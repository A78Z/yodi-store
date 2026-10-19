# Navigation du bas — Maison Yodi-K

Branche `refonte`, Preview Vercel uniquement. Refonte de la barre partagée `Footer` ; le pied de page éditorial validé est conservé.

## Présentation et comportement

Fond ivoire, séparateur sable, icônes fines et texte DM Sans. La rubrique active reçoit un fond sable, une bordure et un petit trait brun. Sur mobile, les quatre accès sont empilés icône/libellé, avec une hauteur de cible de 62 px ; sur ordinateur, les icônes et libellés sont côte à côte dans une grille centrée de 760 px au maximum. Le focus clavier possède un contour brun, et les transitions de couleur respectent `prefers-reduced-motion`.

La barre conserve son positionnement sticky dans le flux et ses quatre destinations : `/`, `/categories`, `/panier`, puis `/profile` ou `/connexion` selon la session existante. Le libellé Compte reste constant, avec un nom accessible adapté à la connexion. Elle reste masquée sur inscription, connexion, récupération/réinitialisation du mot de passe et profil, comme auparavant.

`aria-current="page"` désigne une destination exacte ; `aria-current="location"` indique la rubrique Catégories dans une catégorie, sous-catégorie ou fiche produit, et Panier au checkout. Les catégories dynamiques sont reconnues par le paramètre de route existant, sans liste de slugs ni nouvelle requête. La recherche et les conditions de vente ne sélectionnent aucune rubrique arbitrairement.

Les marges de la barre tiennent compte des zones sûres du navigateur. Le bouton partagé de retour en haut ajoute le même inset inférieur à sa position existante pour rester au-dessus de la barre. Aucun store, prix, suivi, panier, compte, API ou mécanisme de paiement modifié ; aucune dépendance ajoutée.

## Vérifications

Preview testée : https://yodi-store-72wmwtafi-a78zs-projects.vercel.app/#pied-de-page

Commit fonctionnel `c7517d0`. Déploiement Vercel `GrHZRAZv3cQWAybuYyD8u1cAwQku` prêt ; GitHub confirme `success`, environnement `Preview`, `production_environment: false`.

- ESLint sur les deux composants modifiés et `git diff --check` : réussis. Les 26 tests existants passent. TypeScript retrouve les seules 12 erreurs préexistantes hors périmètre (recherche, ProductCarousel, ProductSubcategory, sendProductAvailable) ; aucune dans les fichiers modifiés.
- Contrôle visuel en Preview à 1280, 375 et 320 px : quatre accès lisibles, sans débordement de la barre ; disposition horizontale sur ordinateur, icônes au-dessus des libellés sur mobile. La barre reste disponible pendant le défilement, et le bouton de retour en haut est au-dessus.
- Accueil activé par clic, puis Tab vers Catégories et Entrée : ouverture de `/categories`. Focus brun observé et rubrique Catégories sélectionnée. Ouverture de Huile, puis de la fiche réelle Huile Locks : repère Catégories conservé visuellement.
- Depuis la fiche, le lien Panier ouvre `/panier` : état vide attendu, repère Panier visible à 320 px. Aucun article ajouté ou retiré.
- Depuis Panier, Tab puis Entrée sur Compte ouvre `/connexion`. La barre n’apparaît plus dans l’arbre d’accessibilité de cette page. Aucun formulaire rempli ou soumis. Retour à l’accueil en fin de contrôle.
- Noms accessibles des quatre liens et routes lus dans l’arbre d’accessibilité. Le balisage `nav`, la liste, `aria-current` et les icônes décoratives sont vérifiés dans le code.
- Contrastes calculés des textes : 6,28:1 pour l’état courant, 5,33:1 pour l’état sélectionné et 6,21:1 pour le contour de focus sur ivoire.
- Réduction des animations et marges de zones sûres vérifiées par lecture CSS ; aucune préférence système changée. Aucun essai sur appareil physique à encoche. Le lien Compte avec session authentifiée et le repère au checkout sont relus dans le code, sans session client ni commande créée pendant cette étape.

Aucun build ou serveur local, aucune écriture métier en base, commande, paiement ou email. La vue adaptative Firefox est refermée après vérification.

## Captures

Captures réelles de la Preview, sans interface navigateur ni données personnelles. Le bouton flottant noir est celui de Vercel.

- `screenshots/bottom-navigation-mobile-375.png` : fiche Huile Locks, rubrique Catégories.
- `screenshots/bottom-navigation-mobile-320.png` : panier vide, rubrique Panier.
- `screenshots/bottom-navigation-desktop.png` : pied de page de l’accueil et barre.
- `screenshots/bottom-navigation-desktop-detail.png` : recadrage de la même capture sur le bas de page pour montrer la nouvelle barre.

Fichiers fonctionnels : `components/Footer.tsx`, `components/Footer.module.css`, `components/ScrollToTopButton.tsx`.
