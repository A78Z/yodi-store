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

À compléter après déploiement.

Fichiers fonctionnels : `app/recherche/page.tsx`, `app/recherche/page.module.css`, `components/home/HomeProductTile.tsx`, `lib/category-label.ts`, `lib/catalog.ts`.
