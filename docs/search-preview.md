# Résultats de recherche — Maison Yodi-K

Branche `refonte`, Preview Vercel uniquement. Refonte de `/recherche`, avec conservation de la recherche par titre, insensible à la casse et aux accents, et du paramètre `q`.

## Présentation et fonctionnement

Fond ivoire, titres Fraunces, texte DM Sans, formulaire de recherche dans la page, repères sable et boutons bruns. Grille de trois colonnes sur ordinateur, deux sur mobile. Les cartes validées `HomeProductTile` sont réutilisées : vraies photos carrées, noms complets, prix/remises, devise, ajout borné par le stock mémorisé et notification pour les produits `disponible: false`. La carte distingue désormais « Épuisé » de la limite déjà au panier, utile puisque la recherche conserve aussi les produits sans stock. La requête de l’accueil et son périmètre de produits ne changent pas.

Les liens utilisent `productHref` : l’ancien lien d’une carte avec sous-catégorie omettait l’identifiant du produit et ouvrait la sous-catégorie. Les nouvelles cartes ouvrent la fiche complète. Les prix, le panier et les événements Meta sont ceux du composant validé, avec le contrôle serveur de stock/prix toujours assuré par le checkout.

Le moteur et l’API existants restent inchangés : 24 produits par page, tri existant, mêmes filtres. Le total réel est lu dans `pagination.totalProducts` et des liens précédent/suivant conservent la recherche lorsque plusieurs pages existent. Une nouvelle recherche revient à la première page. Une page au-delà des résultats propose de revenir au début.

Le chargement d’une ancienne recherche est annulé à la navigation pour éviter les résultats périmés. Une erreur HTTP ou réseau possède un état explicite avec relance ; elle n’est plus présentée comme zéro résultat. Sans terme, aucun appel de catalogue n’est envoyé. Les suggestions Huile, Baume et Barbe sont des exemples de requêtes, sans classement de popularité. Les libellés de catégories sont extraits dans un module pur utilisable côté client ; `lib/catalog.ts` les réexporte sans changer le filtrage serveur.

Focus visibles, formulaire nommé, champ étiqueté, titres hiérarchisés, statut annoncé poliment, grille marquée occupée pendant le chargement. Les liens et boutons ont une hauteur d’au moins 44 px. Les animations des cartes respectent la réduction des mouvements existante.

## Contrôles avant Preview

- ESLint ciblé et `git diff --check` réussis.
- 26 tests existants réussis.
- TypeScript : les trois anciennes erreurs de la recherche disparaissent ; les neuf erreurs préexistantes hors périmètre restent dans ProductCarousel, ProductSubcategory et sendProductAvailable. Aucune erreur dans les fichiers modifiés.
- Aucun serveur ni build local, aucune dépendance ajoutée. Aucune écriture en base, migration, commande ou paiement.

## Validation en Preview

Preview déployée : https://yodi-store-41nm0gzc0-a78zs-projects.vercel.app/recherche?q=huile

Commit fonctionnel `4ff4e80`, déploiement Vercel `F8iVGVQ4QYUiSBSptZbiD36iAPB1`. GitHub confirme la réussite, l’environnement `Preview` et `production_environment: false`.

Contrôles complémentaires réalisés dans Firefox le 17 octobre 2026 :

- Recherche `huile` : trois produits réels, Huile Locks à 8 000 FCFA, Huile Volume Cheveux à 7 600 FCFA (ancien prix 8 000), Huile de Barbe à 6 791 FCFA (ancien prix 7 989). Les cartes, prix et commandes sont lisibles à 1280, 375 et 320 px ; captures inspectées. Les noms longs reviennent à la ligne, sans débordement de la grille.
- Formulaire de page : saisie de `zzaucunsoin2026`, Tab vers Rechercher puis Entrée. URL actualisée, zéro produit et panneau avec conseils/suggestions affichés. Le bouton de recherche est atteint au clavier ; le contour de focus est prévu dans les règles CSS.
- Nouvelle saisie `HUILE` puis Entrée : mêmes trois résultats. Le moteur existant conserve son comportement insensible à la casse.
- Depuis les résultats, ouverture de Huile Locks : URL complète `/huile/huile-cheveux/6939bdf396e4c874c38c2e65` et titre de la fiche confirmés. Aucun ajout au panier pendant ces contrôles ; le composant réutilise le comportement déjà vérifié lors de la refonte de Nos produits.
- Effacement du champ puis soumission : route `/recherche`, titre « Un soin en tête ? » et invitation à chercher, sans faux compteur de résultats.
- Aucun email, notification, paiement ou formulaire de compte soumis. Aucune donnée métier modifiée. La vue adaptative de Firefox est refermée après restauration de ses dimensions habituelles (375 × 844).

L’erreur réseau, le bouton de relance, une pagination de plus de 24 résultats, un produit sans stock ou bientôt disponible et une image en erreur n’ont pas été forcés en Preview ; leurs branches sont relues dans le code. Les tests existants couvrent les calculs de prix et quantités. Les règles de réduction des animations sont relues sans changer la préférence système. Aucun essai sur téléphone physique ni changement de devise pendant cette étape.

## Captures

Captures de la Preview réelle, viewport étendu pour présenter les résultats. Sur ordinateur, seul le haut de l’image est recadré pour retirer l’en-tête partagé. Aucune interface du navigateur ni donnée personnelle ; le bouton flottant noir appartient à Vercel.

- `screenshots/search-desktop.png` — trois résultats de HUILE à 1280 px.
- `screenshots/search-mobile-375.png` — trois résultats de huile.
- `screenshots/search-mobile-320.png` — grille à 320 px.
- `screenshots/search-no-results.png` — recherche sans correspondance.

Fichiers fonctionnels : `app/recherche/page.tsx`, `app/recherche/page.module.css`, `components/home/HomeProductTile.tsx`, `lib/category-label.ts`, `lib/catalog.ts`.
