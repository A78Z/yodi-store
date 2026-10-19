# Bouton Commander sur WhatsApp — Preview refonte

Ajout limité aux cartes produits, conformément au brief fourni. Code : `60863c7`.

Preview vérifiée : https://yodi-store-mg4ilt6b4-a78zs-projects.vercel.app/recherche?q=huile
Vercel : https://vercel.com/a78zs-projects/yodi-store.com/UaZ8oAcbqcjG9veVbAsTY1SEuUie
Environnement affiché par Vercel : Preview ; source : refonte.

## Fichiers

- `components/WhatsAppOrderButton.tsx` et `.module.css` : lien partagé, icône WhatsApp existante, couleurs Yodi-K, cible minimale de 46 px, texte sur plusieurs lignes sur les petites cartes.
- `components/home/HomeProductTile.tsx` : accueil et résultats de recherche.
- `components/home/HomeProductCard.tsx` : catégories.
- `components/ProductSubcategory.tsx` : sous-catégories. Le lien produit entoure uniquement son contenu afin de garder les actions indépendantes et d’éviter des liens imbriqués.
- `lib/whatsapp-order.ts` : encodage du message.
- `scripts/whatsapp-order.test.mjs` : trois tests ciblés.

La destination provient de PHONE_COMMERCIAL (+221 78 012 84 86), sans modifier le numéro de conseil existant. L’URL publique utilise SITE_URL et productHref. Chaque carte transmet le nom et le montant qu’elle affiche, remise et devise comprises. Le carrousel historique ProductCarousel, sans utilisation dans les pages actuelles, reste inchangé.

## Vérifications

- 29 tests Node réussis, dont les trois nouveaux tests (numéro, FCFA remisé, USD, accents, caractères spéciaux et route sans sous-catégorie).
- ESLint ciblé réussi. Diff contrôlé avec prise en compte des fins de ligne CRLF existantes.
- TypeScript : les neuf erreurs antérieures subsistent (ObjectId dans ProductCarousel/ProductSubcategory et ReactNode dans sendProductAvailable) ; aucune nouvelle erreur liée à cet ajout.
- Preview Firefox : recherche à 1440 px, recherche à 320 px, catégorie et sous-catégorie à 375 px. Bouton lisible, icône visible, aucun débordement du bouton.
- Liens inspectés sans ouvrir ni envoyer de message WhatsApp : numéro commercial exact et URL publique canonique. Huile de Barbe : 6 791 FCFA après remise de 15 %, puis 12.08 USD avec le taux chargé par le site ; montants du message identiques aux cartes. Devise restaurée en XOF.
- Panier : ajout de Huile Locks confirmé, total 8 000 FCFA, puis retrait de cet unique article de contrôle ; panier laissé vide.
- Aucune création de commande, écriture de catalogue, paiement ni email. Aucun nouveau formulaire ni widget.

## Captures de la Preview

- `screenshots/whatsapp-search-desktop.png`
- `screenshots/whatsapp-search-mobile-320.png`
- `screenshots/whatsapp-category-mobile.png`
- `screenshots/whatsapp-subcategory-mobile.png`

Publication exclusivement sur la branche refonte ; aucun déploiement de production demandé ou effectué.
