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

Preview : https://yodi-store-2p7nqi97c-a78zs-projects.vercel.app/categories

Commit fonctionnel `d1b9b94`, déploiement Vercel `9em13u5TRSpKKvuR3uvb5ivsKAjp`. GitHub confirme `success`, environnement `Preview`, `production_environment: false`.

Contrôles du 17 octobre 2026 :

- La page affiche trois univers réels : Huile (3 produits), Baume (2), Bain & Corps (1). Les photos sont celles des produits rattachés, sans nouvelle image créée ou ajoutée. Les compteurs sont ceux de la réponse existante du catalogue.
- Rendu inspecté à 1280, 375 et 320 px. Trois cartes sur ordinateur, une colonne sur mobile ; titres, photos carrées, compteurs et liens lisibles. Le bloc d’aide et ses deux commandes ont également été inspectés aux petites largeurs, sans débordement.
- Depuis le titre de la grille : Tab atteint Huile, puis Baume, Bain & Corps et Rechercher un soin. Le contour brun de focus de Huile est confirmé visuellement. Chaque carte crée un seul arrêt de tabulation.
- Entrée sur Bain & Corps : ouverture de `/bain-corps`, titre de l’univers confirmé. Les deux autres URL de cartes, `/huile` et `/baume`, sont lues dans l’arbre d’accessibilité et conservent les routes existantes.
- Entrée sur Rechercher un soin : ouverture de `/recherche`, titre « Un soin en tête ? » confirmé. Retour à `/categories` réussi. Le lien WhatsApp et son nom accessible sont vérifiés sans l’ouvrir et sans message envoyé.
- Les états d’absence de catégories, d’échec serveur et d’absence d’image fournie sont relus dans le code, sans provoquer d’incident ni modifier les données. Les règles de réduction des animations sont relues sans changement de préférence système. Contrôle mobile en émulation Firefox, sans téléphone physique.
- Aucun ajout au panier, compte, commande, paiement, notification ou email pendant ces essais. La vue adaptative Firefox est refermée, avec ses dimensions habituelles restaurées (375 × 844).

## Captures

Captures de la Preview réelle, viewport étendu pour montrer la page. Seul l’en-tête partagé et la marge blanche finale sont recadrés. Aucune interface du navigateur ni donnée personnelle ; le bouton noir flottant appartient à Vercel.

- `screenshots/categories-desktop.png`
- `screenshots/categories-mobile-375.png`
- `screenshots/categories-mobile-320.png`

Fichiers fonctionnels : `app/categories/page.tsx`, `app/categories/page.module.css`.
