# Navigation du bas — Maison Yodi-K

Branche `refonte`, Preview Vercel uniquement. Refonte de la barre partagée `Footer` ; le pied de page éditorial validé est conservé.

## Présentation et comportement

Fond ivoire, séparateur sable, icônes fines et texte DM Sans. La rubrique active reçoit un fond sable, une bordure et un petit trait brun. Sur mobile, les quatre accès sont empilés icône/libellé, avec une hauteur de cible de 62 px ; sur ordinateur, les icônes et libellés sont côte à côte dans une grille centrée de 760 px au maximum. Le focus clavier possède un contour brun, et les transitions de couleur respectent `prefers-reduced-motion`.

La barre conserve son positionnement sticky dans le flux et ses quatre destinations : `/`, `/categories`, `/panier`, puis `/profile` ou `/connexion` selon la session existante. Le libellé Compte reste constant, avec un nom accessible adapté à la connexion. Elle reste masquée sur inscription, connexion, récupération/réinitialisation du mot de passe et profil, comme auparavant.

`aria-current="page"` désigne une destination exacte ; `aria-current="location"` indique la rubrique Catégories dans une catégorie, sous-catégorie ou fiche produit, et Panier au checkout. Les catégories dynamiques sont reconnues par le paramètre de route existant, sans liste de slugs ni nouvelle requête. La recherche et les conditions de vente ne sélectionnent aucune rubrique arbitrairement.

Les marges de la barre tiennent compte des zones sûres du navigateur. Le bouton partagé de retour en haut ajoute le même inset inférieur à sa position existante pour rester au-dessus de la barre. Aucun store, prix, suivi, panier, compte, API ou mécanisme de paiement modifié ; aucune dépendance ajoutée.

## Vérifications

À compléter après les contrôles et le déploiement Preview.

Fichiers fonctionnels : `components/Footer.tsx`, `components/Footer.module.css`, `components/ScrollToTopButton.tsx`.
