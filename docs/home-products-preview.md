# Nos produits — refonte de la section d’accueil

Périmètre : branche `refonte`, Preview Vercel uniquement. Aucun changement de base, d’API, de commande, d’email ou de production.

Preview finale : https://yodi-store-1jeut26kv-a78zs-projects.vercel.app/#produits

Commit final : `452843c`, déploiement réussi en environnement `Preview`, `production_environment: false`, contrôlés via les statuts GitHub/Vercel.

## Présentation et périmètre

La section reprend les couleurs ivoire, blanc, brun et sable, les titres Fraunces et le texte DM Sans. La grille présente trois colonnes sur ordinateur et deux sur mobile. Les cartes montrent la photo réelle, la catégorie, le titre, le prix courant, le prix initial barré lorsqu’une remise existe et l’action d’ajout. Les pourcentages proviennent du catalogue ; aucun avis, faux badge de popularité ou avantage produit ajouté.

Le nouveau composant `HomeProductTile` est utilisé uniquement par `HomeProducts`. Le composant partagé `HomeProductCard` reste identique à la version validée et continue à servir les pages catégorie. Les slides, Nos univers, la fiche produit et le panier restent inchangés.

Les images gardent un format carré ; elles sont chargées avec Next Image. Un visuel absent ou en erreur affiche un emplacement explicite. Survol discret, focus visible et règles de réduction des animations sont prévus. Les noms complets restent dans la carte. Sur mobile, les prix initiaux sont placés sous les prix réduits et le libellé visible devient « Ajouter » ; son nom accessible conserve le nom du produit et l’action complète.

La requête de produits reste inchangée : produits ayant du stock, triés du plus récent au plus ancien, douze au maximum. Une réponse vide masque toujours la section. Aucune nouvelle requête ni dépendance ajoutée. Les catégories sont des libellés des catégories existantes ; les URL produit conservent leur catégorie, sous-catégorie et identifiant.

## Prix et panier

Les fonctions `discountedPrice`, `formatMoney` et `productHref` sont réutilisées. Le prix FCFA est arrondi uniquement à l’affichage ; l’USD conserve deux décimales. Les prix bruts et remises restent dans le panier. Les événements Meta existants sont conservés avec leur déduplication.

L’ajout relit la quantité courante du panier au clic et utilise `remainingProductQuantity`, déjà employé sur la fiche produit. Le bouton est désactivé lorsque la quantité disponible est déjà au panier. Le checkout conserve son contrôle serveur du stock et du prix frais. Le message de succès et l’état « Ajouté » sont conservés, avec nettoyage du minuteur au démontage.

Un produit marqué `disponible: false` conserve le bouton et la fenêtre de notification existants. Aucune demande de notification n’a été envoyée pendant les essais.

## Vérifications

- ESLint ciblé réussi ; 26 tests existants réussis, incluant les calculs de prix, devises et quantités restantes.
- TypeScript : aucune nouvelle erreur ; les 12 erreurs préexistantes hors périmètre subsistent. La différence avec `deb7870` confirme que le composant des pages catégorie est inchangé.
- Première Preview isolant les cartes (`112137b`) : contrôle des six produits à 1280, 375 et 320 px. La lecture mobile a conduit à raccourcir le bouton et à aligner les anciens prix sous les prix réduits.
- Ajout d’une unité de Chantily Glow Skin depuis la carte en Preview `112137b` : confirmation d’ajout, panier contenant une unité à 6 175 FCFA, prix initial 6 500 FCFA, remise 325 FCFA, sous-total 6 175 FCFA. Article de test retiré immédiatement ; panier vide restauré. Aucun checkout ou achat effectué.
- Preview finale `452843c` : les six cartes ont été contrôlées et capturées à 1280, 375 et 320 px. Sur mobile, le bouton « Ajouter » reste sur une ligne et l’ancien prix se trouve sous le prix réduit. Les noms accessibles des boutons contiennent toujours le nom du produit et l’action complète.

Aucun compte, commande ou produit modifié en base. Les essais de panier utilisent le stockage local de la Preview et déclenchent les événements de suivi déjà présents dans le parcours.

Les états de quantité maximale, de produit indisponible et d’image en erreur ne sont pas forcés en base. Leurs branches sont relues ; le calcul pur de quantité restante est couvert par les tests existants. Les règles de réduction des animations sont relues sans modifier de préférence système. Aucun serveur de développement ni build local lancé.

## Captures

Les captures sont prises dans la Preview réelle, sans interface du navigateur ni données personnelles. Le bouton flottant noir appartient à Vercel. La hauteur du viewport est étendue pour montrer la grille.

- `screenshots/home-products-desktop.png`
- `screenshots/home-products-mobile-375.png`
- `screenshots/home-products-mobile-320.png`

Le changement manuel de devise et la navigation clavier complète ne sont pas exécutés : Firefox est utilisé en parallèle et a interrompu les dernières interactions. Les fonctions de conversion et de construction d’URL sont identiques aux versions déjà validées ; elles restent couvertes par les tests existants. Les liens de fiches et les noms accessibles ont été lus dans l’arbre d’accessibilité, sans ouvrir de fiche pendant cette étape.

Fichiers fonctionnels : `components/home/HomeProducts.tsx`, `components/home/HomeProducts.module.css`, `components/home/HomeProductTile.tsx`, `components/home/HomeProductTile.module.css`.
