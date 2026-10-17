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

## Validation en Preview du 17 octobre 2026

Preview finale : https://yodi-store-ricifr34t-a78zs-projects.vercel.app/#pied-de-page

Commits fonctionnels : `9f2dd3b`, puis `d4033a4` pour réserver l’espace à droite du copyright et éviter le bouton partagé « Retour en haut ». Déploiement Vercel `DNtGZ66k36NmmZCPiunAormm3Jo7` prêt, branche `refonte`, environnement Preview ; le statut de déploiement GitHub confirme `success` et `production_environment: false`.

- Contrôle de la version finale à 1280, 375 et 320 px : encart, logo, navigation, contacts, paiements et copyright restent lisibles dans le cadre. Les libellés longs reviennent à la ligne. Le copyright de bureau est dégagé du bouton de retour en haut.
- Tabulation depuis le titre de conseil : lien WhatsApp, logo, quatre réseaux sociaux, univers puis accès compte/panier. Focus clair observé sur le lien Huile. Activation au clavier de « Mon panier » : ouverture de `/panier`, état vide attendu, sans ajout ni commande. Parcours testé sur la première Preview ; le seul changement fonctionnel de la suivante concerne l’espacement du copyright.
- URL et noms accessibles des contacts, réseaux et conditions de vente vérifiés dans l’arbre d’accessibilité et le code. Aucun appel téléphonique, email, message ou réseau social déclenché.
- Contrastes calculés sur les couleurs CSS : minimum 5,33:1 pour les combinaisons de texte utilisées ; texte clair sur cacao supérieur à 8:1.
- Réduction des animations vérifiée par lecture des règles CSS, sans changement de préférence système. Contrôle mobile en émulation Firefox ; aucun essai sur téléphone physique.

Captures de la Preview finale, viewport étendu pour présenter le pied de page complet, recadrées uniquement en haut pour retirer la fin de la section produits :

- `screenshots/home-footer-desktop.png` (1280 px)
- `screenshots/home-footer-mobile-375.png`
- `screenshots/home-footer-mobile-320.png`

Le bouton flottant noir appartient à la barre Vercel. Les captures ne contiennent ni interface du navigateur ni données personnelles. La vue adaptative Firefox est refermée après vérification.

Fichiers fonctionnels : `components/home/HomeFooter.tsx`, `components/home/HomeFooter.module.css`, `app/page.tsx`.
