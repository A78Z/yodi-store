"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Bell, Loader2, CheckCircle2, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Regex email (dupliquée volontairement côté client pour ne pas importer
// lib/notifications.ts qui dépend de mongoose — code serveur).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface NotifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  productImage?: string;
}

type FormState = "idle" | "loading" | "success" | "already" | "error";

const NotifyModal = ({
  open,
  onOpenChange,
  productId,
  productName,
  productImage,
}: NotifyModalProps) => {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation client
    if (!EMAIL_REGEX.test(email.trim())) {
      setState("error");
      setMessage("Entre une adresse email valide.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), produitId: productId, website }),
      });
      const data = await res.json();
      if (res.status === 201 || data.status === "created" || data.status === "bot") {
        setState("success");
        setMessage(data.message || `C'est noté ! On te prévient dès que ${productName} arrive.`);
      } else if (data.status === "already") {
        setState("already");
        setMessage(data.message || "Tu es déjà sur la liste, on ne t'oublie pas ! 👍");
      } else {
        setState("error");
        setMessage(data.message || "Une erreur est survenue. Réessaie.");
      }
    } catch {
      setState("error");
      setMessage("Connexion impossible. Vérifie ta connexion et réessaie.");
    }
  };

  // Réinitialise l'état à la fermeture
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setTimeout(() => {
        setState("idle");
        setMessage("");
        setEmail("");
      }, 200);
    }
    onOpenChange(next);
  };

  const done = state === "success" || state === "already";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white max-w-md w-[90vw] sm:w-full font-josefin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#A36F5E] text-xl font-josefin">
            <Bell className="w-5 h-5" aria-hidden="true" />
            {done ? "Inscription enregistrée" : "Sois le premier prévenu !"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Inscription à la notification de disponibilité du produit {productName}
          </DialogDescription>
        </DialogHeader>

        {/* Visuel produit */}
        <div className="flex items-center gap-3">
          {productImage && (
            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
              <Image
                src={productImage}
                alt={productName}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          )}
          <p className="font-medium text-gray-800 text-sm">{productName}</p>
        </div>

        {done ? (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" aria-hidden="true" />
            <p className="text-gray-700">{message}</p>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="mt-2 bg-[#A36F5E] hover:bg-[#916253] text-white font-medium py-2.5 px-6 rounded-lg transition-colors w-full sm:w-auto"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            <p className="text-sm text-gray-600">
              Laisse ton email, on te prévient dès que ce produit est disponible.
            </p>

            {/* Honeypot anti-bot : caché aux humains */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <label htmlFor="notify-email" className="sr-only">
              Adresse email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                aria-hidden="true"
              />
              <input
                id="notify-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                aria-invalid={state === "error"}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A36F5E]/40 focus:border-[#A36F5E]"
              />
            </div>

            {state === "error" && (
              <p className="text-sm text-red-600" role="alert">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={state === "loading"}
              className="w-full bg-[#A36F5E] hover:bg-[#916253] disabled:opacity-60 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {state === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Inscription…
                </>
              ) : (
                "M'inscrire"
              )}
            </button>

            {/* Mention RGPD */}
            <p className="text-[11px] leading-snug text-gray-400 text-center">
              En t&apos;inscrivant, tu acceptes de recevoir un email de
              notification de la part de Yodi-Store. Pas de spam, juste cette
              notif 🤝
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotifyModal;
