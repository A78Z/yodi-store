# Bannière d’accueil — trois slides Maison Yodi-K

Périmètre : branche `refonte`, Preview Vercel uniquement. Aucun changement de base, d’API, de paiement, d’authentification ou de production.

Preview vérifiée : https://yodi-store-57f7ssw2f-a78zs-projects.vercel.app/

Commit fonctionnel : `9a2e5dc`. Déploiement Vercel `kzz2PmbRybRioZwwfkDMTMshGmiC` : statut `Ready`, environnement `Preview`, source `refonte`, contrôlés dans le tableau Vercel.

## Présentation

La bannière statique `HomeHero` est remplacée par un carrousel de trois compositions :

1. La maison : « Le soin naturel, un plaisir à soi. » — fond sable, visuel d’accueil existant, découverte des produits.
2. Les cheveux : « Vos cheveux, votre signature. » — fond terre rosée, visuel existant de la femme aux locs, collection d’huiles.
3. La barbe : « L’art du détail, chaque jour. » — fond sauge, visuel existant de l’homme et des soins, collection de baumes.

Titres Fraunces, texte DM Sans, boutons bruns ou sauge contrastés, légendes et grands numéros sur les photos. Les visuels existants sont réutilisés sans nouvelle image ni nouvelle promesse produit. Aucun faux badge de popularité ou promotion ajouté. Le logo, les en-têtes et les autres sections restent inchangés. L’ancien composant `Slider`, inutilisé par l’accueil, reste hors périmètre.

Sur ordinateur : composition en deux colonnes et barre de navigation intégrée. Sur mobile : photo au-dessus du texte, sélection des trois slides puis commandes de navigation. Les panneaux occupent la même grille pour conserver une hauteur stable lors du changement. La première image reste prioritaire ; les autres utilisent Next Image.

Les liens Huile et Baume sont proposés seulement lorsque ces catégories sont présentes dans les univers visibles déjà chargés par la page. À défaut, le bouton renvoie aux produits de l’accueil. Aucun nouvel appel de catalogue ni accès en écriture ajouté.

## Interactions et accessibilité prévues

- Fondu de 650 ms, arrivée progressive du texte et mouvement léger de la photo à l’entrée.
- Rotation toutes les huit secondes ; boutons précédent/suivant, sélection directe et pause/lecture.
- Pause temporaire au survol ; arrêt à la sélection manuelle et à la prise de focus dans le contenu. La commande de lecture permet la reprise explicite. La rotation s’arrête également lorsque l’onglet est masqué ou la bannière hors de vue.
- Navigation avec les flèches du clavier. Les slides inactives sont `inert` et masquées à l’accessibilité ; leur lien ne doit pas entrer dans l’ordre de tabulation. Annonce polie lors d’un changement manuel, désactivée lors des changements automatiques.
- Cibles d’au moins 44 px, focus visible, libellés explicites et indication du slide courant.
- Balayage horizontal prévu, sans intercepter les petits mouvements ou les gestes principalement verticaux.
- `prefers-reduced-motion` supprime les transitions et la rotation automatique.

## Vérifications effectuées le 17 octobre 2026

- ESLint ciblé réussi.
- 26 tests automatisés réussis. Trois nouveaux tests couvrent les trois slides et leurs destinations selon les univers disponibles, le bouclage dans les deux sens, et la distinction entre balayage horizontal et défilement vertical.
- TypeScript : aucune erreur dans les fichiers modifiés ou ajoutés ; les 12 erreurs préexistantes hors périmètre subsistent.
- Contrôle visuel des trois slides à 1280 px et 375 px. Contrôle supplémentaire du texte et des commandes de la slide Cheveux à 320 px : aucun débordement visible.
- Sélection directe de chaque slide, navigation vers Cheveux avec la flèche droite du clavier, et retour circulaire de la première vers la troisième avec le bouton précédent vérifiés en Preview.
- L’arbre d’accessibilité montre le contenu de la seule slide active.
- Commandes lecture/pause et changement de leurs libellés vérifiés. Une rotation complète de huit secondes en présence continue à l’écran n’a pas été confirmée dans le navigateur pendant les essais en arrière-plan ; sa temporisation et ses conditions d’arrêt ont été relues dans le code.
- Les trois liens ont été suivis : `/#produits`, `/huile` (trois produits) et `/baume` (deux produits), sans ajout au panier ou autre écriture.

Les essais de balayage sur un appareil tactile et l’émulation de la préférence système de réduction des animations ne sont pas exécutés. Le calcul du geste est testé automatiquement ; les règles CSS/JS correspondantes sont relues. Aucun serveur de développement ni build local lancé : les contrôles de rendu portent uniquement sur la Preview.

## Captures

Captures réelles de la Preview, recadrées autour du carrousel, sans interface du navigateur ni données privées. Le bouton flottant noir appartient à Vercel. Le viewport est étendu en hauteur pour montrer les compositions et leurs commandes en entier.

- `screenshots/hero-slide-1-desktop.png`
- `screenshots/hero-slide-2-desktop.png`
- `screenshots/hero-slide-3-desktop.png`
- `screenshots/hero-slide-1-mobile-375.png`
- `screenshots/hero-slide-2-mobile-375.png`
- `screenshots/hero-slide-3-mobile-375.png`
- `screenshots/hero-slide-2-mobile-320.png`

Fichiers fonctionnels : `app/page.tsx`, `components/home/HomeHero.tsx`, `components/home/HomeHero.module.css`, `lib/home-slides.ts`, `scripts/home-slides.test.mjs`.
