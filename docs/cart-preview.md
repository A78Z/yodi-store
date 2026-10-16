# Panier — validation de la Preview

Périmètre : branche `refonte`, Preview Vercel uniquement. La production, les données du catalogue, le checkout et les paiements ne sont pas modifiés.

## Présentation

Le panier reprend les couleurs ivoire, les titres Fraunces, les photos existantes et les boutons bruns des pages déjà validées. La sélection est présentée dans une liste unique, avec quantités et suppression accessibles. Le récapitulatif est à droite sur ordinateur et sous les articles sur mobile. Les états vide et chargement sont prévus ; le chargement attend la réhydratation du panier persistant.

Les prix sans remise restent visibles sans être barrés. Les montants sont calculés en XOF avec leur précision complète avant l’arrondi d’affichage ou la conversion USD. Le sous-total est explicitement hors livraison. Le bouton de calcul de livraison sans fonction a été retiré ; le lien vers `/checkout` est conservé.

## Vérifications effectuées

Preview testée : https://yodi-store-d4qsx808d-a78zs-projects.vercel.app/panier

Commit fonctionnel : `34ff6ef`. GitHub confirme l’environnement `Preview`, `production_environment: false`, déploiement réussi.

- ESLint ciblé réussi ; 14 tests automatisés réussis, dont l’agrégation des quantités/remises avant conversion et l’état vide.
- TypeScript : aucune erreur dans les fichiers modifiés ; 12 erreurs préexistantes subsistent dans la recherche, les anciens carrousels et un email. L’erreur préexistante du panier a disparu.
- Sur cette nouvelle origine de Preview, panier initial vide, puis ajout de produits réels par l’interface. Aucun panier d’une autre origine n’a été remplacé.
- Huile de Barbe : quantité 1 → 2, sous-total 13 581 FCFA ; USD 24.15, conservé après actualisation ; retour à 1 avec bouton de diminution désactivé, puis retrait du dernier article et état vide.
- Sélection finale de démonstration : Huile de Barbe et Huile Locks, une unité chacune. Prix brut 15 989 FCFA, remise 1 198 FCFA, sous-total 14 791 FCFA. Le produit sans remise n’a ni ancien prix barré ni réduction affichée. En USD, sous-total 26.30.
- Contrôle visuel à 1280, 375 et 320 px ; captures issues de l’interface réelle, recadrées au contenu du panier. Le bouton flottant noir appartient à la barre Vercel de Preview.
- Le bouton « Passer à la commande » ouvre le checkout avec les deux articles ; retour au panier réussi. Aucun formulaire de commande n’a été rempli ou soumis, aucun paiement ou email déclenché.

L’ajout a utilisé le suivi analytique existant de la boutique. Le plafond de quantité utilise le stock mémorisé avec l’article ; la validation définitive des stocks et prix reste celle du checkout existant. Aucune écriture métier en base n’a été effectuée pour ces contrôles.

## Captures

- `screenshots/cart-desktop.png`
- `screenshots/cart-mobile-375.png`
- `screenshots/cart-mobile-320.png`
- `screenshots/cart-empty-mobile.png`
