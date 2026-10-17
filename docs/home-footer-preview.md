# Pied de page — Maison Yodi-K

Branche `refonte`, validation en Preview Vercel uniquement. Refonte du pied de page de l’accueil (`HomeFooter`), dans la continuité des sections validées.

## Présentation

Encart de conseil sable avec titre Fraunces, texte DM Sans et bouton WhatsApp. Le pied de page cacao regroupe la marque, les réseaux sociaux, les univers, les accès au compte et au panier, les conditions de vente, les contacts et les moyens de paiement. Quatre colonnes sur grand écran ; une composition adaptée sur tablette et mobile, avec deux colonnes pour les liens et des contacts sur toute la largeur. Les liens possèdent un focus visible ; les cibles font au moins 44 px de hauteur. Les transitions de couleur respectent la préférence de réduction des animations.

Le logo et les illustrations de paiement existants sont conservés. Les coordonnées viennent de `lib/site.ts`, les univers des données déjà lues par la page ; aucun appel supplémentaire. Les URL des réseaux sociaux et des conditions de vente sont conservées. Le lien « Mon panier » réutilise `/panier`. Les liens externes annoncent leur ouverture dans un nouvel onglet dans leur nom accessible, avec `noopener noreferrer`.

Le pied de page est placé après le contenu principal pour former un repère sémantique distinct. Le menu de navigation inférieur partagé et les pieds de page des autres écrans restent inchangés. Aucun formulaire, newsletter, avis, nouvel avantage commercial ou nouvelle dépendance ajouté.

## Vérifications avant Preview

- ESLint ciblé sur `HomeFooter.tsx` et `app/page.tsx` : réussi.
- 26 tests existants : réussis.
- TypeScript : les 12 erreurs préexistantes dans recherche, ProductCarousel, ProductSubcategory et sendProductAvailable subsistent ; aucune erreur dans les fichiers modifiés.
- `git diff --check` : réussi.
- Aucun build ni serveur local lancé. Aucune donnée, commande, paiement ou compte modifié.

## Validation visuelle

À compléter après déploiement Preview.

Fichiers fonctionnels : `components/home/HomeFooter.tsx`, `components/home/HomeFooter.module.css`, `app/page.tsx`.
