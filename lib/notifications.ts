// lib/notifications.ts
// Logique métier partagée par la route API (modale JS) ET le server action (fallback no-JS).
import { connectDB } from "@/lib/db";
import ProductModel from "@/lib/models/product";
import EmailNotificationModel from "@/lib/models/emailNotification";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeStatus =
  | "created" // nouvelle inscription
  | "already" // déjà inscrit
  | "invalid_email"
  | "not_found" // produit inexistant
  | "available" // produit déjà disponible → inutile de s'inscrire
  | "rate_limited"
  | "bot" // honeypot rempli : on ignore silencieusement
  | "error";

export interface SubscribeResult {
  status: SubscribeStatus;
  message: string;
}

// ----------------------------------------------------------------------------
// Rate limiting en mémoire (best-effort). Limite: 5 inscriptions / IP / minute.
// NOTE: en environnement serverless (Vercel), la mémoire n'est pas partagée
// entre instances. Pour une protection stricte en production, brancher un store
// partagé (Upstash Redis). Voir ADMIN_HANDOFF.md.
// ----------------------------------------------------------------------------
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000;
const ipHits = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

// Nettoie/normalise l'email (anti-injection : on ne garde qu'un email plausible)
export function sanitizeEmail(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.trim().toLowerCase().slice(0, 254);
}

export interface SubscribeInput {
  email: unknown;
  produitId: unknown;
  honeypot?: unknown; // champ caché : si rempli => bot
  ip?: string;
}

export async function subscribeToProduct(
  input: SubscribeInput
): Promise<SubscribeResult> {
  // 1) Honeypot anti-bot : on répond "succès" sans rien enregistrer.
  if (typeof input.honeypot === "string" && input.honeypot.trim() !== "") {
    return { status: "bot", message: "C'est noté !" };
  }

  // 2) Rate limiting par IP
  if (input.ip && isRateLimited(input.ip)) {
    return {
      status: "rate_limited",
      message: "Trop de tentatives. Réessaie dans une minute.",
    };
  }

  // 3) Validation email
  const email = sanitizeEmail(input.email);
  if (!email || !EMAIL_REGEX.test(email)) {
    return { status: "invalid_email", message: "Adresse email invalide." };
  }

  // 4) Validation produitId
  const produitId =
    typeof input.produitId === "string" ? input.produitId.trim() : "";
  if (!produitId || !/^[a-fA-F0-9]{24}$/.test(produitId)) {
    return { status: "not_found", message: "Produit introuvable." };
  }

  try {
    await connectDB();

    const produit = await ProductModel.findById(produitId).lean<{
      _id: unknown;
      title: string;
      disponible?: boolean;
    }>();

    if (!produit) {
      return { status: "not_found", message: "Produit introuvable." };
    }

    // On ne s'inscrit que pour un produit ACTUELLEMENT indisponible.
    if (produit.disponible !== false) {
      return {
        status: "available",
        message: "Ce produit est déjà disponible 🎉",
      };
    }

    // 5) Déduplication via l'index unique (email + produitId)
    const existing = await EmailNotificationModel.findOne({ email, produitId });
    if (existing) {
      return {
        status: "already",
        message: "Tu es déjà sur la liste, on ne t'oublie pas ! 👍",
      };
    }

    await EmailNotificationModel.create({
      email,
      produitId,
      produitNom: produit.title,
    });

    return {
      status: "created",
      message: `C'est noté ! On te prévient dès que ${produit.title} arrive.`,
    };
  } catch (err: unknown) {
    // Cas de course : insertion concurrente => violation de l'index unique
    if (
      typeof err === "object" &&
      err !== null &&
      (err as { code?: number }).code === 11000
    ) {
      return {
        status: "already",
        message: "Tu es déjà sur la liste, on ne t'oublie pas ! 👍",
      };
    }
    console.error("subscribeToProduct error:", err);
    return { status: "error", message: "Une erreur est survenue. Réessaie." };
  }
}

// Nombre de personnes en attente d'un produit (preuve sociale)
export async function getWaitingCount(produitId: string): Promise<number> {
  if (!/^[a-fA-F0-9]{24}$/.test(produitId)) return 0;
  try {
    await connectDB();
    return await EmailNotificationModel.countDocuments({ produitId });
  } catch {
    return 0;
  }
}
