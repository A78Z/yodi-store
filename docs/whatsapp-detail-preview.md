# Bouton WhatsApp sur la fiche produit

Code : e2b9b85, branche refonte uniquement.

Preview vérifiée : https://yodi-store-2rw2l8la5-a78zs-projects.vercel.app/huile/huile-barbe/692b12ba3a24b70e9159fd43
Déploiement Vercel (environnement Preview, source refonte) : https://vercel.com/a78zs-projects/yodi-store.com/BMjLR8bECvgsVD9oNN4GkrDLVetY

## Modification

`components/ProductDetail.tsx` : import et utilisation du composant WhatsAppOrderButton déjà validé sur les cartes, après l’action panier et son retour de statut. Même style, icône, libellé et numéro commercial +221 78 012 84 86. Le nom et le prix unitaire remisé proviennent des valeurs affichées sur la fiche. La construction du message et de l’URL publique reste partagée avec les cartes.

## Vérifications

- ESLint ciblé et git diff --check réussis.
- Sept tests ciblés réussis : message WhatsApp, affichage des prix et quantité produit. Aucun nouveau test nécessaire pour cette réutilisation du composant.
- Preview Firefox : affichage à 320 px et à 1440 px ; bouton visible, lisible, sans débordement et placé sous l’action panier.
- Lien inspecté sans ouvrir WhatsApp ni envoyer de message : Huile de Barbe, prix remisé de 6 791 FCFA ; passage en USD, prix de 12.08 USD identique dans le message et sur la fiche. Numéro commercial et URL canonique https://yodi-k.com/huile/huile-barbe/692b12ba3a24b70e9159fd43 corrects. Devise restaurée en XOF.
- Aucune modification des gestionnaires du panier, des quantités ou des notifications, ni du lien « Besoin d’un conseil ? ». Aucun formulaire ajouté, aucune commande, aucun paiement ni email déclenché pendant ces contrôles.

Captures : `screenshots/whatsapp-detail-mobile-320.png` et `screenshots/whatsapp-detail-desktop.png`.

Aucune modification de master/main ni publication en production.
