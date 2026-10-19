# Vérification globale du parcours WhatsApp

Date : 17 octobre 2026. Branche : refonte. État contrôlé : fafc351 ; code fonctionnel c4f7742, commits intermédiaires de documentation uniquement.
Preview utilisée : https://yodi-store-kkadqjple-a78zs-projects.vercel.app

Aucune anomalie nécessitant une correction. Contrôles avec coordonnées fictives ; navigation jusqu’à la page WhatsApp sans envoyer de message.

## Contrôles réalisés lors de cette vérification

| Entrée | Scénario réellement contrôlé sur la Preview | Résultat |
| --- | --- | --- |
| Carte de recherche | Huile Volume Cheveux remisée, quantité 2 | Prix 7 600 FCFA ; sous-total 15 200 FCFA ; message reçu avec produit, quantité, URL publique, téléphone et adresse corrects |
| Fiche produit | Huile de Barbe, quantité 2 choisie avant ouverture | Quantité reprise ; prix 6 791 FCFA ; sous-total 13 581 FCFA ; message reçu conforme, arrondi effectué après calcul |
| Panier | Trois références, quantités enregistrées 1/1/1 ; ajustement de Huile Locks à 2 dans la demande uniquement | Message reçu avec les trois références, quantités 2/1/1, montants 16 000 / 7 600 / 6 791 FCFA et sous-total 30 391 FCFA ; trois liens canoniques complets |

Pour les trois entrées, le formulaire puis le récapitulatif restent sur la Preview. Seule l’action finale navigue vers WhatsApp. Destinataire réellement vérifié dans chaque lien externe : 221780128486, distinct du téléphone client de démonstration. Accents et sauts de ligne conservés ; lignes nom/note absentes lorsqu’elles sont vides. Frais de livraison explicitement à confirmer.

Sur la carte, « Continuer » sans coordonnées est bloqué avec erreurs sur téléphone, rue et ville ; focus sur le téléphone. « Modifier » conserve coordonnées et quantité. La commande au clavier et le clic final ont été exercés. Les demandes Firefox d’ouverture de l’application WhatsApp ont été annulées.

Après retour du test panier, quantités enregistrées toujours 1/1/1 et sous-total toujours 22 391 FCFA : l’ajustement dans la demande ne modifie pas le panier. Réouverture à l’étape 1 avec téléphone et adresse vides. Échap ferme le formulaire et rend le focus au bouton du panier. Les trois références ajoutées uniquement pour le test ont ensuite été retirées ; panier initial vide rétabli. Devise laissée en XOF.

## Couverture commune et contrôles mobiles déjà effectués

Inspection du code actuel : accueil et recherche utilisent HomeProductTile ; catégories utilisent HomeProductCard ; sous-catégories utilisent ProductSubcategory. Ces trois composants, la fiche et le panier appellent le même WhatsAppOrderButton et le même WhatsAppOrderForm. Le carrousel historique inutilisé dans les pages actuelles reste hors périmètre.

Cette passe rejoue les trois clics finaux sur ordinateur. Elle complète les contrôles mobiles précédents, sans les présenter comme de nouveaux tests :

- Cartes : recherche à 320 px, catégories et sous-catégories à 375 px ; voir whatsapp-order-preview.md et whatsapp-form-preview.md.
- Fiche : clic final réellement effectué en vue Firefox 375 × 844, coordonnées canadiennes fictives, 12.08 USD, destinataire marchand et lien canonique vérifiés ; voir whatsapp-final-action-preview.md.
- Panier : clic final réellement effectué en vue Firefox 375 × 844, trois références et quatre articles, montants 14.23 / 13.52 / 24.15 USD, sous-total 51.89 USD ; coordonnées canadiennes et absence des champs facultatifs vides vérifiées ; voir whatsapp-cart-final-click-preview.md.

Aucun téléphone physique disponible : ouverture native et envoi dans l’application non testés.

## Vérifications techniques de cette passe

42 tests Node réussis (`node --test scripts/*.test.mjs`), dont validation Sénégal/Canada, champs requis, stock et indisponibilité, quantités invalides, prix remisés FCFA/USD, encodage unique, accents, notes multilignes, liens canoniques, destinataire fixe, panier de 30 lignes sans troncature et absence de mutation du panier. ESLint ciblé sur le bouton, le formulaire et la bibliothèque WhatsApp réussi ; git diff --check réussi.

Aucun changement de code ; compte rendu seul ajouté. Aucune commande, aucun paiement, email ou envoi WhatsApp, aucune modification de la base, de main/master ou de la production. Publication limitée à refonte et sa Preview.
