# Toutes nos catégories — Maison Yodi-K

Branche `refonte`, validation exclusivement en Preview Vercel. Refonte de `/categories` dans le style des univers de l’accueil déjà validés.

## Présentation et périmètre

La page utilise les couleurs ivoire, blanc, sable et brun, les titres Fraunces et le texte DM Sans. Le titre et le fil d’Ariane précèdent une grille de trois cartes sur ordinateur, une sur mobile. Les photos carrées proviennent directement des produits rattachés aux univers, comme sur l’accueil ; les anciens visuels éditoriaux de présentation sont retirés de cette page. Les noms et liens restent visibles sous les images. Chaque carte est un seul lien, avec numéro décoratif, nom de catégorie, nombre réel de produits et invitation à explorer.

Les données et le filtrage restent exclusivement ceux de `getVisibleUnivers` : catégories visibles contenant au moins un produit actif, compatibilité temporaire déjà autorisée pour les réglages de visibilité absents. Les compteurs reprennent `productCount` (tous les produits rattachés), sans les présenter comme un stock disponible. Le total d’univers est calculé depuis la liste retournée. Aucun classement ni compteur codé en dur.

Les URL `/${slug}` sont conservées. Le bloc d’aide réutilise WhatsApp depuis `lib/site.ts` et ajoute un accès à la recherche validée `/recherche`. Les métadonnées, le canonical `/categories` et les données structurées CollectionPage sont préservés. La page reste rendue côté serveur, sans nouvelle dépendance, requête supplémentaire, état client ou modification des autres écrans.

Un état sans univers et un état de chargement impossible sont distincts ; le second propose un lien de rechargement. Aucun produit, catégorie ou réglage n’est créé pour simuler ces états. Une catégorie sans image fournie utilise une présentation typographique ; aucune image inventée ajoutée.

Les liens ont un contour de focus visible, les icônes décoratives sont masquées aux aides techniques et le lien WhatsApp annonce le nouvel onglet. Les photos ne répètent pas le titre déjà présent dans le lien. Les transitions sont supprimées avec la préférence de réduction des animations.

## Vérifications avant Preview

- ESLint ciblé et `git diff --check` réussis. Le lien natif Réessayer est conservé explicitement pour forcer une nouvelle lecture serveur après erreur.
- 26 tests existants réussis. TypeScript retrouve les neuf erreurs préexistantes hors périmètre dans ProductCarousel, ProductSubcategory et sendProductAvailable ; aucune dans la page modifiée.
- Aucun serveur de développement ni build local. Aucune modification de données, migration, commande, paiement ou email.

## Vérification en Preview

À compléter après déploiement et contrôles.

Fichiers fonctionnels : `app/categories/page.tsx`, `app/categories/page.module.css`.
