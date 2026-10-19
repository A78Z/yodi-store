# Page de commande — Preview

Périmètre : `refonte`, Preview Vercel uniquement. API de commande, base de données, livraison et moyens de paiement conservés. Aucun déploiement en production.

Preview vérifiée : https://yodi-store-r7u1hrt6d-a78zs-projects.vercel.app/checkout

Commit fonctionnel : `84dce03`. Déploiement réussi, environnement GitHub `Preview`, `production_environment: false`.

## Changements

- Présentation Maison Yodi-K : ivoire, titres Fraunces, sections numérotées coordonnées / livraison / paiement, récapitulatif avec les photos existantes.
- Formulaire sémantique avec labels, autocomplétion, champs obligatoires et validation native avant soumission. Correction de l’inversion prénom/nom.
- Téléphone et code postal, déjà exigés par le modèle de commande, préremplis depuis le compte et désormais modifiables dans le formulaire.
- Attente de la session et du panier persistant avant affichage ; détails du compte initialisés une fois sans écraser les saisies en cours.
- Zones existantes du Sénégal et du Canada conservées ; le changement de pays efface la zone précédente.
- Même tarif fixe de livraison : 1 500 XOF. Même paiement `on-delivery` ; Wave et Orange Money restent indisponibles.
- Montants d’affichage partagés avec le panier : calcul des remises et quantités en XOF avant conversion/arrondi final, y compris les lignes USD et le total XOF.
- Envoi via le même `POST /api/checkout` et la même structure de commande. Verrou d’envoi et bouton désactivé pendant la requête ; confirmation persistante dans la page après succès et erreurs lisibles avec focus.
- Compte toujours requis par l’API. En visiteur, invitation à se connecter et confirmation désactivée. État explicite lorsque le panier est vide.

## Contrôles effectués

- ESLint ciblé réussi. Les 14 tests existants passent, dont les calculs du panier et les validations serveur des prix, stocks, quantités, doublons et devises d’affichage.
- TypeScript : pas d’erreur dans la page modifiée ; les 12 erreurs préexistantes hors périmètre restent présentes.
- Dans Firefox, sur la nouvelle origine de Preview : état panier vide, puis ajout par l’interface de deux unités de Huile de Barbe. Aucun panier d’une autre origine remplacé.
- En FCFA : ligne/sous-total 13 581, remise déjà déduite 2 397, livraison 1 500, total affiché 15 081.
- En USD : ligne/sous-total 24.15, remise déjà déduite 4.26, livraison 2.67, total 26.82.
- Sans pays : zone désactivée. Sénégal : zones sénégalaises. Canada : zones canadiennes ; sélection de Montreal par le clavier. Retour au Sénégal : sélection effacée, puis choix de Mermoz.
- Labels prénom/nom vérifiés dans l’arbre d’accessibilité. Paiement à la livraison explicite ; moyens indisponibles non interactifs. Confirmation désactivée sans connexion.
- Captures de l’interface réelle à 1280, 375 et 320 px, recadrées au contenu de la commande. Aucun débordement du récapitulatif à 320 px. Le bouton flottant noir appartient à Vercel Preview.

## Limites des essais

Aucune création de compte, connexion à un compte client ou soumission de commande effectuée. Aucun `POST /api/checkout`, paiement ou email déclenché. Le préremplissage connecté, les erreurs de requête et le succès après création ont été relus dans le code, sans simulation d’une vraie commande dans la base. L’ajout au panier et l’ouverture du checkout utilisent le suivi analytique existant.

## Captures

- `screenshots/checkout-desktop.png` : les trois sections et le récapitulatif.
- `screenshots/checkout-mobile-375.png` : viewport mobile étendu.
- `screenshots/checkout-mobile-form.png` et `screenshots/checkout-mobile-end.png` : extraits lisibles du même viewport à 375 px.
- `screenshots/checkout-mobile-320.png` : contrôle de l’affichage étroit.
