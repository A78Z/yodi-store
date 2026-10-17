# Demande WhatsApp depuis le panier — refonte

Code vérifié : d1e02fa, sur la seule branche refonte.
Preview : https://yodi-store-oxnlonfz3-a78zs-projects.vercel.app/panier
Vercel : https://vercel.com/a78zs-projects/yodi-store.com/DSyxLeJNuGeXECVkYxeJJawi4v9A
Environnement : Preview ; source : refonte.

## Modification

Le bouton « Commander sur WhatsApp » est ajouté au panier sous « Passer à la commande ». Il ouvre le même formulaire en deux étapes que les cartes et la fiche, avec toutes les lignes du panier.

Chaque ligne contient la photo réelle, le nom, le prix unitaire remisé, la quantité et son montant. Les quantités de départ viennent du panier et peuvent être ajustées pour la demande WhatsApp seulement, sans mutation du panier enregistré. Leur maximum correspond au stock de la ligne, sans soustraire une seconde fois les unités qui sont déjà dans ce panier. Aucune ligne n’est omise ; une ligne indisponible bloque la demande.

Le récapitulatif affiche tous les produits, leurs quantités et montants, le sous-total, les coordonnées et les champs facultatifs. Le message final reprend chaque produit avec son URL publique canonique et le sous-total dans la devise affichée. Le destinataire reste le numéro commercial +221 78 012 84 86. Le lien n’est construit et ouvert qu’au dernier clic. Aucune commande ni aucun paiement n’est confirmé par ce parcours.

## Fichiers

- `app/panier/page.tsx` : insertion du bouton partagé pour le panier non vide.
- `components/WhatsAppOrderButton.tsx` : prise en charge du panier et du produit individuel.
- `components/WhatsAppOrderForm.tsx` : liste des produits et quantités locales ; coordonnées et récapitulatif partagés.
- `components/WhatsAppOrderForm.module.css` : présentation de plusieurs lignes et montants par produit.
- `lib/whatsapp-order.ts` : validation de toutes les lignes et message WhatsApp du panier.
- `scripts/whatsapp-cart-order.test.mjs` : cinq tests ciblés.

## Vérifications techniques

40 tests Node réussis, dont les neuf tests du parcours individuel et cinq nouveaux tests : toutes les lignes du panier, prix après remise, montants FCFA/USD, calcul avant arrondi, quantités et disponibilité, panier vide, coordonnées invalides, téléphone canadien, accents/notes, URL canoniques, aucune troncature d’un panier de 30 lignes et absence de mutation des données sources.

ESLint ciblé et git diff --check réussis. TypeScript retrouve les neuf erreurs antérieures dans ProductCarousel, ProductSubcategory et sendProductAvailable ; aucune nouvelle erreur dans les fichiers concernés.

Aucune nouvelle dépendance ni modification du checkout, des paiements, des emails ou de la base. Les coordonnées restent en mémoire dans le parcours ouvert, puis sont effacées à la fermeture.

## Vérifications Preview

Contrôle sur ordinateur puis en vue mobile à 375 × 844 : panier avec Huile Locks × 1 et Huile de Barbe × 2, sous-total initial de 21 581 FCFA. Ouverture interne de l’étape 1 avec toutes les lignes et leurs quantités. Augmentation de Huile Locks à 2 dans le formulaire : montant de la demande 29 581 FCFA, tandis que le panier enregistré garde son montant de 21 581 FCFA.

« Continuer » sans coordonnées est bloqué avec erreurs par champ. Après saisie de coordonnées fictives, le récapitulatif contient les deux références, quatre articles, les montants et l’adresse. « Modifier » conserve les coordonnées et les quantités ajustées. Aucun clic final ni message réel ; le destinataire et le contenu du lien final sont vérifiés par les tests de la fonction utilisée par le bouton.

Contrôle de non-régression en Preview : la fiche Huile de Barbe ouvre toujours son formulaire individuel avec un produit, une quantité de 1 et le sous-total de 6 791 FCFA. Fermeture par Échap avec retour du focus au bouton.

Après fermeture, le panier conserve ses quantités d’origine. Les deux références utilisées pour le contrôle ont ensuite été retirées : le panier Preview est laissé vide. Aucun bouton de demande n’est affiché dans cet état vide.

Captures mobiles à 375 × 1300 pour montrer les deux étapes :
- `screenshots/whatsapp-cart-step1-mobile.png`
- `screenshots/whatsapp-cart-step2-mobile.png`

Aucune écriture de base, aucune commande, aucun paiement ni email déclenché. Aucune modification de master/main ni déploiement en production.
