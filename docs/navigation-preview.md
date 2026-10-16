# Navigation Maison Yodi-K — Preview uniquement

Périmètre : menu ordinateur et mobile, sur la branche `refonte` existante. Aucun déploiement de production, aucune fusion, aucune écriture dans la base.

## Catalogue vérifié le 16 octobre 2026

Lecture directe MongoDB du catalogue configuré dans le dépôt, via le pilote natif (aucun modèle Mongoose initialisé pendant cet audit). Six produits ; seules les catégories `huile`, `baume` et `bain-corps` ont des produits. Relations utilisées : `category` et `subCategory`, sans interprétation du titre ni du stock.

La collection `categories` est absente et aucun produit ne porte de champ explicite d'activité. La compatibilité existante considère un produit actif si `disponible !== false` ; le schéma définit déjà la valeur par défaut à `true`. Les réglages de visibilité manquants restent visibles : compatibilité temporaire validée par l'utilisateur pour cette Preview. Les réglages explicites `visible: false` restent respectés, y compris les sous-catégories identifiées par leur chemin `parent/sous-categorie`. Une erreur de lecture des réglages n'est plus ignorée.

Baume BARBE porte `category: baume`, `subCategory: huile-a-barbe`. La navigation conserve donc `/baume/huile-a-barbe` et son libellé enregistré dans le code. `/baume/baume-barbe` n'a aucun produit. Aucune correction de données, de libellé déduit du produit ou redirection appliquée.

## Implémentation

- `components/CategoryNavigation.tsx` : liens et déclencheurs séparés, panneau typographique de 600 px, clic/tactile/clavier, Échap avec retour au bouton, clic extérieur et fermeture après navigation. Ouverture au survol différée de 160 ms et fermeture de 180 ms, sans espace entre barre et panneau.
- `components/CategoryNavigation.module.css` : barre ivoire de 60 px, indicateur actif, cartes sobres, focus visible et réduction des animations.
- `components/SheetMenu.tsx` : accès Boutique, feuille Radix existante, titre et description accessibles, fermeture explicite, accordéons et liens vers tous les produits. Piège de focus, retour au déclencheur et verrouillage du défilement fournis par Radix Dialog.
- `components/Hero.tsx` : remplacement du seul menu ; logo, recherche, panier et devise conservés.
- `lib/catalog.ts` : lecture agrégée existante conservée, prise en compte des masquages de sous-catégories et suppression du repli silencieux en cas d'erreur de lecture des réglages.

## Vérification

- ESLint ciblé : réussi.
- Tests existants : 8/8 réussis.
- TypeScript global : 20 erreurs identiques à la branche avant modification, vérifiées sur une extraction temporaire de HEAD (panier, recherches, composants produits et email). La configuration existante ignore ces erreurs au build ; aucune modification de cette configuration.
- Contrastes calculés : texte principal/ivoire 13,55:1 ; liens bruns/ivoire 6,21:1 ; texte secondaire/ivoire 6,28:1.
- Preview Vercel construite avec succès : commit `9e04660`, environnement confirmé `Preview` et `production_environment: false` dans GitHub.
- URL du déploiement testé : https://yodi-store-n91gq1kdy-a78zs-projects.vercel.app ; alias de branche : https://yodi-storecom-git-refonte-a78zs-projects.vercel.app . Accès protégé par la connexion Vercel ; essais réalisés dans la session Firefox existante.
- Ordinateur : ouverture au clic ; ouverture par flèche bas avec focus sur « Voir tous les produits » ; Tab vers la première sous-catégorie ; Échap ferme et rend le focus au chevron ; clic extérieur ferme. Les deux liens Huile pointent vers les chemins existants. Soulignement actif observé sur `/huile`.
- Mobile : affichages contrôlés à 320, 375 et 390 px. Accordéon Huile ouvert, sous-catégories et lien vers tous les produits lisibles ; aucun débordement horizontal du menu observé. Échap ferme la feuille et ramène au bouton Boutique. Shift+Tab depuis la fermeture boucle vers le dernier lien, confirmant le piège de focus.
- Simulation tactile Firefox activée à 320 px après rechargement : ouverture de Boutique et de Baume, puis navigation vers `/baume/huile-a-barbe` réussies ; la feuille se ferme et la page affiche bien Baume BARBE. Simulation désactivée et vue adaptative fermée après les essais.
- Captures : `screenshots/menu-desktop-detail.png` et `screenshots/menu-mobile-390.png`. Le petit bouton noir est la barre de feedback Vercel, propre à la Preview.
- Limites : réduction des animations vérifiée dans le CSS, sans changement de préférence système pendant les essais. Déplacement du pointeur sans clic et verrouillage du défilement arrière-plan non mesurés directement. Aucun test de commande, paiement, compte ou email ; aucune action d'écriture métier exécutée.
