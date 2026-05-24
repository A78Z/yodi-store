# SPEC-ADMIN-AVIS — Gestion des avis clients depuis l'admin

> État actuel : les témoignages sont **codés en dur** dans
> [`components/Testimonials.tsx`](components/Testimonials.tsx) (tableau `testimonials`),
> marqués comme **échantillons à valider/remplacer par de vrais avis**.
> Ce document décrit la structure à implémenter côté admin (admin.yodi-k.com) pour les rendre gérables.

## Modèle proposé (collection `avis`)
```ts
interface Avis {
  _id: ObjectId;
  texte: string;
  auteur: string;        // ex: "Aïssatou D."
  ville?: string;        // ex: "Dakar, Plateau"
  note: number;          // 1..5
  verifie: boolean;      // true UNIQUEMENT si commande réelle vérifiée
  avatar?: string;       // URL photo (sinon initiales auto sur fond dégradé)
  produitId?: ObjectId;  // optionnel : avis lié à un produit
  actif: boolean;        // afficher ou non
  ordre?: number;
  createdAt: Date;
}
```

## Routes
- `GET/POST /api/admin/avis` (protégées), `PATCH/DELETE /api/admin/avis/:id` (protégées)
- `GET /api/avis` (publique) → avis `actif:true`, triés par `ordre`/date

## Côté frontend
Remplacer le tableau `testimonials` codé en dur par un fetch (SSR via `app/page.tsx`).
Le composant gère déjà : étoiles, initiales auto si pas d'avatar, hover, responsive.

## ⚠️ Honnêteté commerciale (rappel)
- **N'afficher une note globale / un nombre de clients QUE s'ils sont réels.** Actuellement : cadrage soft « Une communauté grandissante… » sans chiffre.
- **Badge « Achat vérifié » uniquement pour de vraies commandes** (champ `verifie`). Non affiché tant que non vérifiable.
- Collecter de vrais avis (WhatsApp/commandes) avec accord de la personne pour prénom + ville (+ photo éventuelle).
