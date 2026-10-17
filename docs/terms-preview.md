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

À compléter après le déploiement et les contrôles visuels.

Fichiers fonctionnels : `app/condition-dutilisations/page.tsx`, `app/condition-dutilisations/page.module.css`.
