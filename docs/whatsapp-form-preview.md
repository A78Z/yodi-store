# Demande WhatsApp en deux étapes — refonte

Code vérifié : a9ba632, sur la seule branche refonte.

Preview finale : https://yodi-store-b4cqxgh6l-a78zs-projects.vercel.app/huile/huile-barbe/692b12ba3a24b70e9159fd43
Vercel : https://vercel.com/a78zs-projects/yodi-store.com/DasdsXm6sQVQuer9Vkk6dB25Ymya
Environnement affiché : Preview ; source : refonte.

Le brief mis à jour demande désormais un formulaire avant WhatsApp. Cette correction remplace le lien direct sur tous les emplacements du composant partagé : cartes et fiche produit.

## Fichiers modifiés

- `components/WhatsAppOrderButton.tsx` : bouton interne et dialogue Radix existant ; adaptation à la hauteur du viewport visuel lors de l’ouverture du clavier mobile.
- `components/WhatsAppOrderButton.module.css` : curseur du bouton, présentation conservée.
- `components/WhatsAppOrderForm.tsx` et `.module.css` : étapes coordonnées et récapitulatif, données limitées à l’état React de l’ouverture courante, pied visible et contenu défilant.
- `components/ProductDetail.tsx` : transmission de la quantité choisie sur la fiche au formulaire.
- `lib/whatsapp-order.ts` : validation Sénégal/Canada, adresse, quantité et génération du lien final.
- `scripts/whatsapp-order.test.mjs` : neuf tests ciblés.

## Comportement

Le bouton ouvre immédiatement le formulaire Yodi-K. Photo réelle, nom et prix affichés, quantité modifiable et limitée au stock restant après les unités présentes dans le panier. Aucun modèle de variante n’existe dans le catalogue actuel ; aucune variante n’est inventée. Aucun service d’autocomplétion n’existe dans le checkout : adresse manuelle avec quartier/rue, ville et pays.

Téléphone et adresse obligatoires, erreurs par champ ; indicatifs Sénégal +221 et Canada +1. Nom et note facultatifs dans un accordéon fermé au départ. « Continuer » valide puis affiche le récapitulatif. « Modifier » conserve toutes les données du parcours. Seul « Envoyer la demande sur WhatsApp » construit le lien et ouvre WhatsApp au numéro commercial +221 78 012 84 86. L’utilisateur doit encore envoyer le message lui-même.

Sous-total calculé avec le prix remisé non arrondi multiplié par la quantité, puis affiché avec les fonctions de prix du site. Les frais de livraison restent à confirmer. Les coordonnées ne sont ni enregistrées en base ni ajoutées à l’URL de Yodi-K, aux analytics ou aux journaux ; aucun stockage persistant. Fermer le dialogue efface les saisies.

## Vérifications techniques

35 tests Node réussis, dont neuf sur le parcours WhatsApp : formats nationaux et internationaux des deux pays, champs obligatoires, limites de quantité, montant après remise en FCFA/USD, arrondi du sous-total, accents et note sur plusieurs lignes, numéro commercial et URL publique canonique, rejet de la génération d’un lien avec données invalides.

ESLint ciblé et git diff --check réussis. TypeScript retrouve les neuf erreurs antérieures dans ProductCarousel, ProductSubcategory et sendProductAvailable ; aucune nouvelle erreur liée au formulaire.

## Vérifications Preview

Sur ordinateur : ouverture interne sans navigation, « Continuer » vide bloqué avec erreurs et focus sur le téléphone ; quantité 2, prix unitaire affiché 6 791 FCFA, sous-total 13 581 FCFA (le calcul conserve le prix exact de 6 790,65 FCFA avant l’arrondi). Nom et note facultatifs visibles dans le récapitulatif ; retour « Modifier » conserve toutes les saisies. Contrôles avec coordonnées fictives uniquement. Aucun message réel envoyé.

Sur mobile : formulaire plein écran, défilement du contenu et pied accessible ; contrôle à 375 px et viewport réduit 320 × 480 pour la hauteur disponible, sans test sur clavier physique. Deux captures à 375 × 1200 montrent les étapes complètes. La fenêtre passe au-dessus du bouton existant de retour en haut, sans modifier ce dernier. Le positionnement est propre à ce formulaire ; la gestion du focus repose sur Radix, déjà installé.

Un numéro canadien fictif de 10 chiffres avec l’indicatif +1 a été validé en Preview ; le récapitulatif affiche +18195550123, sans imposer le format sénégalais. Fermeture par Échap et par la croix contrôlées, retour du focus au bouton d’origine ; une nouvelle ouverture montre les champs vides et l’étape 1. Les données de démonstration ont été effacées en fermant la fenêtre. Le panier n’a pas été modifié pendant cette correction.

Le lien final et son message sont vérifiés par les tests de la fonction appelée par le bouton final ; aucun clic final avec transmission de coordonnées ni aucun envoi de message WhatsApp pendant les contrôles. Aucune écriture de base, création de compte, commande, paiement ou email.

## Captures

- `screenshots/whatsapp-form-step1-mobile.png`
- `screenshots/whatsapp-form-step2-mobile.png`
- `screenshots/whatsapp-form-step2-desktop.png`

Le petit contrôle noir visible sur les captures est présent dans le navigateur de vérification et n’a pas été ajouté par cette correction.

Aucune modification de main/master, aucune fusion et aucun déploiement de production.
