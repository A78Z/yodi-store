# Correction du clic final WhatsApp — refonte

Code vérifié : c4f7742, branche refonte uniquement.
Preview : https://yodi-store-kkadqjple-a78zs-projects.vercel.app/huile/huile-barbe/692b12ba3a24b70e9159fd43
Vercel : https://vercel.com/a78zs-projects/yodi-store.com/3JyDqXgesZcWCPqXmUREAh7JUtFW
Environnement affiché : Preview ; source : refonte.

## Changement limité à l’action finale

- `components/WhatsAppOrderForm.tsx` : navigation directe synchrone par `window.location.assign(href)` au clic final, à la place de `window.open`. La validation précède la navigation. Ajout d’une erreur utile si les informations du produit ou son prix sont invalides.
- `lib/whatsapp-order.ts` : destinataire marchand fixe `221780128486`, indépendant du téléphone client. Texte aligné sur le brief, vrais sauts de ligne et encodage unique avec encodeURIComponent. Nom et note absents lorsqu’ils sont vides. Le message du panier garde toutes ses lignes. Les URL non canoniques et produits invalides sont refusés.
- `scripts/whatsapp-order.test.mjs` et `scripts/whatsapp-cart-order.test.mjs` : attentes du nouveau texte et tests du modèle exact, des liens invalides et de la séparation destinataire/client.

Aucune modification du JSX de présentation, des styles ou des champs. Le formulaire puis le récapitulatif restent internes à Yodi-K. Aucun changement du panier, du checkout, des paiements ou des emails. Aucune variante n’existe dans le modèle actuel et aucune ligne de variante vide n’est ajoutée. Les frais ne sont pas calculés dans ce parcours : « Livraison : frais à confirmer ».

## Vérifications

42 tests Node réussis ; ESLint ciblé et git diff --check réussis. TypeScript retrouve les neuf erreurs antérieures de ProductCarousel, ProductSubcategory et sendProductAvailable ; aucune nouvelle erreur dans les fichiers de cette correction.

Preview Firefox sur ordinateur : clic « Commander » → coordonnées, puis « Continuer » → récapitulatif, sans navigation extérieure. Le clic final mène dans le même onglet à la page WhatsApp. Contrôle avec Huile de Barbe × 2 : prix unitaire affiché 6 791 FCFA, sous-total 13 581 FCFA. Le message complet reprend le nom et la note fictifs, les accents, « & », « # », les sauts de ligne, le numéro client et l’URL publique du produit. Destinataire marchand : 221780128486. WhatsApp propose son application ou WhatsApp Web et Firefox affiche la demande d’ouverture de l’application. Celle-ci a été annulée, sans envoi.

Preview en vue mobile Firefox 375 × 844 : même clic final effectué avec une quantité de 1, prix et sous-total de 12.08 USD, coordonnées canadiennes fictives et nom/note laissés vides. La page WhatsApp reçue contient le destinataire 221780128486 et le téléphone client distinct +18195550123, l’adresse de démonstration à Montréal, le bon montant USD, les sauts de ligne et le lien public canonique. Les lignes facultatives vides sont absentes. Demande d’ouverture de l’application annulée, sans envoi. Devise restaurée en XOF après vérification.

Les coordonnées fournies dans la capture utilisateur n’ont pas été utilisées ni publiées. Les contrôles utilisent uniquement des coordonnées fictives. Aucun envoi de message réel, aucune fausse confirmation d’envoi, aucune écriture de base, commande ou paiement. La page intermédiaire WhatsApp est normale.

Limite : le clic est vérifié sur ordinateur et en vue mobile dans Firefox ; l’ouverture native sur un téléphone physique et l’envoi dans WhatsApp ne sont pas testés.

Aucune fusion, modification de master/main ou mise en production.
