# SPEC-ADMIN-HERO — Gestion des slides du hero depuis l'admin

> État actuel : les slides du hero sont **codées en dur** dans le frontend
> ([`components/Slider.tsx`](components/Slider.tsx)). Aucune gestion admin n'existe encore.
> Ce document décrit la structure à implémenter dans le dépôt admin (admin.yodi-k.com)
> pour rendre les slides éditables — à faire dans une étape ultérieure.

## Modèle de données proposé (collection `heroslides`)

```ts
interface HeroSlide {
  _id: ObjectId;
  ordre: number;            // ordre d'affichage (1, 2, 3, …)
  actif: boolean;           // afficher ou non cette slide
  image: string;            // URL de l'image (idéalement < 200 Ko, branding yodi-k)
  imageAlt: string;         // texte alternatif (accessibilité + SEO)
  // CTA principal (obligatoire)
  ctaTexte: string;         // ex: "Découvrir nos huiles"
  ctaLien: string;          // route interne EXISTANTE, ex: "/huile/cheveux"
  // Optionnels (pour une future version "texte en overlay" avec visuels propres)
  eyebrow?: string;         // ex: "⭐ Nouveauté · Huile capillaire"
  titre?: string;           // ex: "Huile Rasta"
  sousTitre?: string;
  bullets?: string[];       // 3 max
  badge?: string;           // ex: "Nouveau" / "Best-seller"
  ctaSecondaireTexte?: string;
  ctaSecondaireLien?: string;
}
```

## Routes admin à créer
- `GET  /api/admin/hero-slides` (protégée) → liste triée par `ordre`
- `POST /api/admin/hero-slides` (protégée) → créer
- `PATCH /api/admin/hero-slides/:id` (protégée) → modifier (ordre, actif, image, CTA…)
- `DELETE /api/admin/hero-slides/:id` (protégée)
- `GET /api/hero-slides` (publique, frontend) → slides `actif:true` triées par `ordre`

## Côté frontend (quand l'admin sera prêt)
Remplacer le tableau `slides` codé en dur dans `components/Slider.tsx` par un fetch
de `GET /api/hero-slides` (en SSR via `app/page.tsx`, comme déjà fait pour le carrousel
produits). Le reste du composant (autoplay, dots, flèches, swipe, a11y, trust bar) reste inchangé.

## Recommandations sur les images (IMPORTANT)
Les bannières actuelles (`/public/slider/banniere_*.png`) :
- contiennent du **texte intégré** + l'**ancien domaine "www.yodi-store.com"** (banniere_1) → **à refaire** avec le branding **yodi-k.com** ;
- étaient très lourdes (jusqu'à 9,5 Mo) → redimensionnées à 2400px de large dans cette étape (originaux sauvegardés dans `backup-assets/slider/`).
- format conseillé pour les futures bannières : **largeur ~2400px, < 200 Ko, WebP ou PNG**, ratio ~2400×835 (≈ 2.87:1).
