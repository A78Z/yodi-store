# Handoff Admin — Système "Bientôt disponible" (Étape 2)

Ce document contient le code à intégrer dans le **dépôt admin séparé** (`admin.yodi-k.com`).
La partie frontend (yodi-k.com) et les modèles partagés sont **déjà implémentés** dans le repo `yodi-store`.

## Pré-requis côté admin
- Les modèles Mongoose `product` et `emailNotification` doivent exister (copier
  [`lib/models/emailNotification.ts`](lib/models/emailNotification.ts) du repo frontend, ou pointer vers la même base).
- Le champ `disponible: Boolean (default true)` doit être présent sur le modèle Product.
- Variables d'env : `RESEND_2IBN_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME` (cf. `.env.example`).
- L'admin doit avoir un **rôle/garde** (le repo frontend n'a PAS de rôle admin). Adapter `requireAdmin()` ci-dessous à votre système d'auth admin.

---

## 1.3.b — `GET /api/admin/notifications` (protégée)

```ts
// app/api/admin/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import EmailNotificationModel from "@/lib/models/emailNotification";
import { requireAdmin } from "@/lib/auth-admin"; // À implémenter selon votre auth

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const sp = new URL(req.url).searchParams;
  const produitId = sp.get("produitId");
  const statut = sp.get("statut"); // "notifie" | "non-notifie"
  const sort = sp.get("sort") || "recent"; // recent | ancien

  const filter: Record<string, unknown> = {};
  if (produitId) filter.produitId = produitId;
  if (statut === "notifie") filter.notifie = true;
  if (statut === "non-notifie") filter.notifie = false;

  await connectDB();
  const items = await EmailNotificationModel.find(filter)
    .sort({ dateInscription: sort === "ancien" ? 1 : -1 })
    .lean();

  return NextResponse.json({ total: items.length, items });
}
```

## 1.3.c — `PATCH /api/admin/products/:id/disponibilite` (protégée + déclenche les emails)

```ts
// app/api/admin/products/[id]/disponibilite/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ProductModel from "@/lib/models/product";
import { sendProductAvailableEmails } from "@/lib/email/sendProductAvailable"; // copié du repo frontend
import { requireAdmin } from "@/lib/auth-admin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const { disponible } = await req.json();
  if (typeof disponible !== "boolean") {
    return NextResponse.json({ message: "Champ 'disponible' requis (boolean)" }, { status: 400 });
  }

  await connectDB();
  const product = await ProductModel.findById(id);
  if (!product) return NextResponse.json({ message: "Produit introuvable" }, { status: 404 });

  const passeDispo = product.disponible === false && disponible === true;
  product.disponible = disponible;
  await product.save();

  // Passage indisponible -> disponible : on prévient les inscrits.
  let emailResult = null;
  if (passeDispo) {
    emailResult = await sendProductAvailableEmails({
      _id: String(product._id),
      title: product.title,
      imageUrl: product.imageUrl,
      price: product.price,
      discount: product.discount,
      category: product.category,
      subCategory: product.subCategory,
    });
  }

  return NextResponse.json({ disponible: product.disponible, emailResult });
}
```

> `sendProductAvailableEmails` et le template `productAvailableTemplate.tsx` sont **déjà écrits** dans le repo frontend ([`lib/email/sendProductAvailable.ts`](lib/email/sendProductAvailable.ts), [`components/productAvailableTemplate.tsx`](components/productAvailableTemplate.tsx)). Copier ces 2 fichiers dans le repo admin.

---

## 1.5 — Interface admin

### a) Toggle "Produit disponible" + compteur d'attente (page produit admin)

```tsx
"use client";
import { useState, useEffect } from "react";

export function DisponibiliteToggle({ productId, initial }: { productId: string; initial: boolean }) {
  const [dispo, setDispo] = useState(initial);
  const [count, setCount] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!dispo) {
      fetch(`/api/admin/notifications?produitId=${productId}`)
        .then((r) => r.json())
        .then((d) => setCount(d.total || 0));
    }
  }, [dispo, productId]);

  async function toggle() {
    setSaving(true);
    const next = !dispo;
    const res = await fetch(`/api/admin/products/${productId}/disponibilite`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disponible: next }),
    });
    if (res.ok) {
      const data = await res.json();
      setDispo(data.disponible);
      if (data.emailResult) alert(`${data.emailResult.sent} email(s) de notification envoyé(s).`);
    }
    setSaving(false);
  }

  return (
    <div>
      <label>
        <input type="checkbox" checked={dispo} onChange={toggle} disabled={saving} />
        Produit disponible
      </label>
      {!dispo && (
        <p>{count} personne(s) en attente — <a href={`/admin/notifications?produitId=${productId}`}>Voir la liste</a></p>
      )}
    </div>
  );
}
```

### b) Page `/admin/notifications` — tableau + filtres + export CSV

```tsx
// Tableau : Email | Produit | Date inscription | Statut.
// Filtres : ?produitId= & ?statut=notifie|non-notifie & ?sort=recent|ancien (gérés par la route GET ci-dessus).
// Export CSV (côté client, sans dépendance) :
function exportCSV(items) {
  const header = "email,produitNom,dateInscription,notifie\n";
  const rows = items
    .map((i) => `${i.email},"${i.produitNom}",${new Date(i.dateInscription).toISOString()},${i.notifie}`)
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "liste-attente-yodi.csv";
  a.click();
  URL.revokeObjectURL(url);
}
```

> **Notifier manuellement** : ajouter une route `POST /api/admin/notifications/:id/notify` qui appelle le template/Resend pour un seul abonné (réutiliser le code de `sendProductAvailableEmails` pour un destinataire).

### c) Widget dashboard "Produits en attente" (top 5)

```ts
// app/api/admin/notifications/top/route.ts — agrégation des produits les plus demandés
import EmailNotificationModel from "@/lib/models/emailNotification";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const top = await EmailNotificationModel.aggregate([
    { $group: { _id: "$produitId", produitNom: { $first: "$produitNom" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);
  return Response.json({ top });
}
```

Afficher ce top 5 sur le dashboard : c'est l'info la plus précieuse pour prioriser l'approvisionnement.

---

## Partie 3 — Notes techniques

- **Rate limiting (prod)** : le frontend utilise un limiteur en mémoire (5/IP/min) — best-effort, non partagé entre instances serverless. Pour une vraie protection, brancher **Upstash Redis** (`@upstash/ratelimit`) dans `lib/notifications.ts`.
- **CORS** (Partie 3.4) : la route publique `POST /api/notifications/subscribe` vit sur le **frontend** (yodi-k.com) → pas de souci CORS (même origine). Les routes `/api/admin/*` sont sur admin.yodi-k.com : restreindre l'`Access-Control-Allow-Origin` à `https://yodi-k.com` (ou same-origin admin) via middleware/next.config.
- **Validation** : faite côté client (modale) ET serveur (`subscribeToProduct`), avec sanitation de l'email et regex stricte (anti-injection).
- **RGPD** : mention de consentement affichée dans la modale ; lien de désinscription dans chaque email → route `GET /api/notifications/unsubscribe?id=` (déjà sur le frontend).

## Test end-to-end
1. `node --env-file=.env scripts/seed-test-unavailable.mjs` (marque 2 produits indisponibles).
2. Sur yodi-k.com : la carte affiche "BIENTÔT DISPONIBLE" + bouton "🔔 Me prévenir" → s'inscrire.
3. Admin : basculer le toggle du produit sur "disponible" → l'email part automatiquement aux inscrits.
4. Vérifier `notifie: true` + `dateNotification` sur la collection `emailnotifications`.
