# SPEC-ADMIN-TOPBAR — Gestion des messages de la top bar depuis l'admin

> État actuel : les messages de la top bar sont **codés en dur** dans
> [`components/Header.tsx`](components/Header.tsx) (tableau `messages`). Aucune gestion admin.
> Ce document décrit la structure à implémenter côté admin (admin.yodi-k.com) pour les rendre éditables — étape ultérieure.

## Modèle proposé (collection `topbarmessages`)

```ts
interface TopBarMessage {
  _id: ObjectId;
  ordre: number;       // ordre d'affichage dans la rotation
  actif: boolean;      // afficher ou non
  icone: string;       // nom d'icône lucide (ex: "Truck", "CreditCard", "Leaf", "Phone", "Gift")
  texte: string;       // supporte un gras simple, ex: "Livraison **sous 24h** à Dakar"
  sousTexte?: string;  // ex: "du lundi au samedi"
  lien?: string;       // optionnel ; si renseigné, le message est cliquable
  dateDebut?: Date;    // optionnel : planifier un message (promo, événement)
  dateFin?: Date;
}
```

## Routes admin à créer
- `GET/POST /api/admin/topbar` (protégées)
- `PATCH/DELETE /api/admin/topbar/:id` (protégées)
- `GET /api/topbar` (publique) → messages `actif:true`, dans la fenêtre de dates, triés par `ordre`

## Côté frontend (quand l'admin sera prêt)
Remplacer le tableau `messages` codé en dur dans `Header.tsx` par un fetch de `GET /api/topbar`
(via un composant serveur parent ou un fetch au montage). La rotation 5s, la pause au survol et
l'accessibilité (`aria-live`) restent inchangées.

## Liens à créer (aujourd'hui inexistants)
Le brief suggérait des liens `/livraison`, `/paiement`, `/about`, `/promo` qui **n'existent pas encore**.
Pour éviter les 404, ils n'ont PAS été câblés : seuls les messages informatifs + le **téléphone (`tel:`)** sont actifs.
Quand ces pages existeront, renseigner `lien` sur chaque message.
