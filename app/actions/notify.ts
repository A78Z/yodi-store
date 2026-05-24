"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { subscribeToProduct } from "@/lib/notifications";

// Server Action utilisée par le formulaire natif (fallback SANS JavaScript).
// Sur succès/erreur, on redirige vers la page produit avec un flag ?notify=...
// que la page lit pour afficher une bannière (fonctionne même sans JS).
export async function notifySubscribeAction(formData: FormData) {
  const email = formData.get("email");
  const produitId = formData.get("produitId");
  const honeypot = formData.get("website");
  const returnTo = (formData.get("returnTo") as string) || "/";

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "unknown";

  const result = await subscribeToProduct({ email, produitId, honeypot, ip });

  const sep = returnTo.includes("?") ? "&" : "?";
  redirect(`${returnTo}${sep}notify=${result.status}`);
}
