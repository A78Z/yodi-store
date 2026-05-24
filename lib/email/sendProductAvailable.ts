// lib/email/sendProductAvailable.ts
// Envoie l'email "produit disponible" à tous les abonnés en attente d'un produit,
// puis marque chaque notification comme envoyée (notifie: true).
// Appelée par l'admin lors du passage disponible=false -> true (voir ADMIN_HANDOFF.md).
import { Resend } from "resend";
import { connectDB } from "@/lib/db";
import EmailNotificationModel from "@/lib/models/emailNotification";
import ProductAvailableTemplate from "@/components/productAvailableTemplate";
import { SITE_URL } from "@/lib/site";

// Clé lue UNIQUEMENT depuis l'environnement (jamais de secret en dur).
const resend = new Resend(
  process.env.RESEND_2IBN_API_KEY || process.env.RESEND_API_KEY
);

// Expéditeur configurable. Par défaut : domaine déjà vérifié chez Resend.
// Pour passer à contact@yodi-k.com : vérifier d'abord le domaine yodi-k.com chez Resend.
const FROM_NAME = process.env.EMAIL_FROM_NAME || "Yodi-Store";
const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@ibendouma.com";
const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;

interface ProductLike {
  _id: string;
  title: string;
  imageUrl?: string;
  price: number;
  discount?: number;
  category: string;
  subCategory?: string;
}

export interface SendResult {
  total: number;
  sent: number;
  failed: number;
}

function buildProductUrl(p: ProductLike): string {
  if (p.subCategory) return `${SITE_URL}/${p.category}/${p.subCategory}`;
  return `${SITE_URL}/${p.category}/product/${p._id}`;
}

function formatPrice(p: ProductLike): string {
  const final = p.discount && p.discount > 0
    ? Math.round(p.price - (p.price * p.discount) / 100)
    : p.price;
  return `${final.toLocaleString("fr-FR")} FCFA`;
}

export async function sendProductAvailableEmails(
  product: ProductLike
): Promise<SendResult> {
  await connectDB();

  const subscribers = await EmailNotificationModel.find({
    produitId: product._id,
    notifie: false,
  });

  const result: SendResult = { total: subscribers.length, sent: 0, failed: 0 };
  const produitUrl = buildProductUrl(product);
  const prix = formatPrice(product);

  for (const sub of subscribers) {
    try {
      await resend.emails.send({
        from: FROM,
        to: [sub.email],
        subject: `🎉 ${product.title} est enfin disponible chez Yodi-Store !`,
        react: ProductAvailableTemplate({
          produitNom: product.title,
          produitImage: product.imageUrl,
          prix,
          produitUrl,
          unsubscribeUrl: `${SITE_URL}/api/notifications/unsubscribe?id=${sub._id}`,
        }),
      });
      sub.notifie = true;
      sub.dateNotification = new Date();
      await sub.save();
      result.sent++;
    } catch (err) {
      console.error(`Échec envoi notification à ${sub.email}:`, err);
      result.failed++;
    }
  }

  return result;
}
