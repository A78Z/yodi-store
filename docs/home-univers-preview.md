# Nos univers — refonte de la section d’accueil

Branche `refonte`, Preview Vercel uniquement. Aucun changement des données, des API ou de la production.

Preview finale : https://yodi-store-ju7nhdgcg-a78zs-projects.vercel.app/#univers

Commits fonctionnels : `32ce2e0`, puis `a3ac887` pour conserver le cadrage carré des photos sur mobile. Déploiement final réussi, environnement `Preview`, `production_environment: false`, vérifiés via les statuts GitHub/Vercel.

## Présentation et données

La section reprend les couleurs ivoire, blanc, brun et sable, les titres Fraunces et le texte DM Sans. Elle présente de grandes cartes photo, un titre de collection, une invitation à la découvrir et une flèche. Un lien « Explorer la boutique » ouvre `/categories`. Les numéros décoratifs indiquent l’ordre visuel des cartes.

Trois colonnes sur ordinateur ; une colonne sur mobile. Les photographies gardent le format carré pour préserver le cadrage des produits. Le survol agrandit légèrement l’image et colore la flèche ; les transitions sont supprimées avec `prefers-reduced-motion`. Un contour brun extérieur indique le focus clavier.

Le composant reste rendu côté serveur, sans dépendance, état client ou requête supplémentaire. Il utilise les mêmes univers visibles, images et libellés fournis par `getVisibleUnivers`. Le filtrage de disponibilité et la compatibilité temporaire des réglages de visibilité restent inchangés. Le nombre de cartes dépend des données ; en l’absence d’univers, la section reste masquée. Aucun avantage produit, avis, promotion ou nouvelle photo inventé.

Les routes des cartes restent `/${slug}` : Huile, Baume et Bain & Corps sont les trois univers disponibles pendant les essais. Les trois slides validées et les autres sections restent inchangées.

## Vérifications du 17 octobre 2026

- ESLint ciblé réussi ; 26 tests existants réussis. Aucun nouveau test ajouté pour cette modification de présentation.
- TypeScript : aucune erreur dans le composant modifié ; les 12 erreurs préexistantes hors périmètre subsistent.
- Contrôle visuel de la Preview finale à 1280, 375 et 320 px. Les trois cartes, leurs titres et les commandes restent dans le cadre. Le premier contrôle mobile a conduit à conserver le format carré, qui préserve le haut des flacons d’huile.
- Tabulation : lien de la boutique → Huile → Baume → Bain & Corps. Chaque carte forme un seul lien ; la flèche ne crée pas d’arrêt supplémentaire. Contour de focus observé sur la carte Huile dans la Preview finale.
- Activation de Bain & Corps avec Entrée contrôlée sur la première Preview.
- Sur la Preview finale, les quatre liens ont été suivis : `/categories`, `/huile` (trois produits), `/baume` (deux produits), `/bain-corps` (un produit). Aucun ajout au panier, achat ou appel d’écriture déclenché.
- Les règles de réduction des animations ont été relues ; aucune préférence système modifiée pendant les essais. Le tactile sur appareil physique n’est pas testé.

Aucun serveur de développement ni build local lancé : les vérifications de rendu portent uniquement sur la Preview.

## Captures

Captures réelles de la Preview finale, recadrées sur la section. Le viewport est étendu en hauteur pour montrer les trois cartes mobiles. Le bouton flottant noir appartient à Vercel.

- `screenshots/home-univers-desktop.png`
- `screenshots/home-univers-mobile-375.png`
- `screenshots/home-univers-mobile-320.png`

Fichiers fonctionnels : `components/home/HomeUnivers.tsx`, `components/home/HomeUnivers.module.css`.
