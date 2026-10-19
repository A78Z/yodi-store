# Conditions générales de vente — Maison Yodi-K

Branche `refonte`, Preview Vercel uniquement. Refonte de présentation de la route existante `/condition-dutilisations`.

## Contenu et présentation

Les cinq articles existants sont conservés mot pour mot, y compris leurs listes, délais, noms et mentions de paiement. Une comparaison automatisée du texte des cinq articles avant/après, après normalisation des espaces et entités JSX, confirme leur identité. Cette étape ne révise pas les conditions de vente.

La page adopte les couleurs ivoire, blanc, sable et brun, les titres Fraunces et le texte DM Sans. Sur ordinateur, un sommaire latéral accompagne la lecture ; sur mobile, il précède les articles. Les cinq liens d’ancre ouvrent les sections identifiées et titrées, avec une marge de défilement. Les encarts de livraison et paiement utilisent un fond ivoire avec un séparateur brun. Le contact email existant est conservé dans un encart sable, avec un bouton mailto explicite. Aucun formulaire ni acceptation des CGV ajouté.

La date précédemment générée à chaque rendu sous « Dernière mise à jour » devient « Consulté le » : aucune date de révision juridique n’est inventée. Le rendu serveur est dynamique pour que cette date corresponde à l’affichage. La page n’effectue aucune requête de données. Métadonnées et canonical explicites ajoutés sur la route existante. Les coordonnées proviennent toujours de `lib/site.ts`.

Les paragraphes utilisent une taille de 14 px et un interligne ample, avec des lignes limitées par le panneau de lecture. Les liens du sommaire et commandes ont une hauteur d’au moins 44 px et un contour de focus brun. Les liens longs reviennent à la ligne. Aucun comportement dépendant du survol, nouvelle dépendance ou changement des autres pages.

## Contrôles avant Preview

- Cinq comparaisons de texte d’article réussies ; contenu identique.
- ESLint ciblé et `git diff --check` réussis ; 26 tests existants réussis.
- TypeScript : aucune erreur dans les fichiers modifiés ; les neuf erreurs préexistantes hors périmètre restent dans ProductCarousel, ProductSubcategory et sendProductAvailable.
- Aucun serveur ni build local ; aucune modification de données, commande, paiement, compte ou email.

## Validation en Preview

Preview finale : https://yodi-store-pvxvtn3d6-a78zs-projects.vercel.app/condition-dutilisations

Commits fonctionnels : `1d30eb4`, puis `ddbd726` pour empêcher le point d’interrogation du titre de contact de rester seul sur une ligne à 320 px. Déploiement final `4FKRMYjGGMbgV4in25Sq345h9uF1`, prêt dans Vercel ; GitHub confirme `success`, environnement `Preview`, `production_environment: false`.

- Inspection de la première Preview à 1280, 375 et 320 px : titre, sommaire, cinq articles, listes et encarts lisibles. Les paragraphes et adresses reviennent à la ligne. Le sommaire est à gauche sur ordinateur et avant les articles sur mobile.
- Depuis « Dans cette page », Tab atteint Présentation, puis les entrées suivantes. Après trois tabulations supplémentaires, Entrée sur Livraison ouvre `#article-4` ; URL et article ciblé confirmés. Depuis l’article 4, Tab atteint Revenir au premier article ; Entrée ouvre `#article-1`.
- Les cinq ancres, les titres associés et les styles de focus sont relus dans le code ; les noms de liens et la position de focus sont également confirmés dans l’arbre d’accessibilité.
- Encarts Livraison et Paiement et pied du document inspectés à 375 et 320 px. La mention « Consulté le 17/10/2026 » est présente, sans fausse date de révision. Les deux liens mailto et leur adresse sont vérifiés sans ouverture ni envoi d’email.
- La Preview finale est inspectée à 320 px sur le bas de page : le point d’interrogation reste lié au titre, le contact et le bouton Nous écrire tiennent dans le cadre. La comparaison des textes confirme à nouveau que les cinq articles sont identiques après cette retouche.
- Les règles de réduction des animations sont relues sans changer de préférence système. Contrôle en émulation Firefox, sans téléphone physique. Aucun formulaire d’acceptation, achat, paiement ou compte utilisé. Les dimensions de contrôle sont restaurées à 375 × 844 et la vue adaptative est refermée.

## Captures

Captures réelles des Previews, sans interface du navigateur ni données personnelles. Le haut de l’image est recadré pour les vues de début de page. Le bouton noir flottant appartient à Vercel.

- `screenshots/terms-desktop.png` — sommaire et cinq articles à 1280 px, Preview `1d30eb4`.
- `screenshots/terms-mobile-375.png` — début de page à 375 px, même Preview.
- `screenshots/terms-mobile-320.png` — début de page à 320 px, même Preview.
- `screenshots/terms-mobile-375-details.png` — encarts et contact à 375 px, même Preview.
- `screenshots/terms-mobile-320-details.png` — bas de page à 320 px, Preview finale `ddbd726`.

Fichiers fonctionnels : `app/condition-dutilisations/page.tsx`, `app/condition-dutilisations/page.module.css`.
