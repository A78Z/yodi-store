# Vérification générale du site — mobile et ordinateur

Date : 17 octobre 2026. Branche : refonte uniquement.

## Résultat et correction

Une anomalie responsive reproduite puis corrigée : à 768 px, le bandeau supérieur imposait sur une seule ligne un message non rétractable, la recherche et le téléphone. Le contact dépassait de la fenêtre. `components/Header.tsx` autorise maintenant le retour à la ligne et donne au message sa propre ligne entre 768 et 1279 px ; la recherche peut rétrécir. À partir de 1280 px, les trois éléments gardent leur disposition sur une ligne. Les petits écrans conservent la recherche sous le logo.

Commit fonctionnel : f353b46. Nouvelle Preview Vercel confirmée Ready, branche refonte :
https://yodi-store-mf8a36mm0-a78zs-projects.vercel.app
Déploiement : https://vercel.com/a78zs-projects/yodi-store.com/59eAaEo6Fs7rsaXjYeR6yLyjqZxq

L’audit initial porte sur https://yodi-store-kkadqjple-a78zs-projects.vercel.app (code c4f7742, identique au démarrage de cette passe hors documentation). Les contrôles après correction sont décrits séparément ci-dessous.

## Couverture de cette passe

Firefox sur ordinateur ; vues adaptatives 320 × 844, 375 × 844, 768 × 844 et 1440 × 844. La vue normale de la fenêtre a également été utilisée. Contrôle visuel avec captures et lecture des libellés accessibles ; essais de navigation au clic et au clavier. Il s’agit d’un audit manuel des pages publiques et états accessibles sans compte, pas d’une certification de tous les navigateurs ou de toutes les combinaisons de données.

| Zone | Contrôles effectués |
| --- | --- |
| Accueil | Affichage ordinateur, mobile 320 px et tablette ; images des slides chargées ; pause et sélection de la première diapositive ; rotation observée vers les slides cheveux et barbe ; présence des univers et des six produits |
| Menu | Ordinateur : ouverture Huile et fermeture Échap ; mobile 320 px : ouverture Boutique, accordéon Huile, lien Huile cheveux, fermeture après navigation |
| Navigation du bas | Accès réel aux catégories, au panier et à la connexion ; état actif visible ; espace réservé en bas des pages observées |
| Toutes nos catégories | Trois univers, comptes 3/2/1 produits, images et liens ; grille ordinateur et empilement mobile 375 px |
| Catégories | Huile sur ordinateur : filtre Huile barbe donnant un seul produit ; Baume sur mobile : tri croissant donnant 6 650 puis 8 000 FCFA ; Bain & Corps : produit et lien chargés |
| Sous-catégorie | Huile cheveux atteinte depuis le menu mobile ; deux produits et actions lisibles à 320 px ; aucun produit ajouté par ce seul passage |
| Fiches | Huile Locks atteinte depuis sa carte mobile ; agrandissement de photo et fermeture Échap ; ajout au panier ; lecture de la présentation mobile. Chantily Glow Skin : route /bain-corps/product/... sans sous-catégorie chargée avec le bon nom et prix remisé. Huile de Barbe relue sur ordinateur après correction |
| Recherche | « huile » : trois résultats et cartes lisibles à 320 px ; saisie puis envoi d’une requête longue sans résultat ; titre passant à la ligne, état vide et suggestions présents |
| Panier | État initial vide confirmé ; ajout de Huile Locks depuis sa fiche mobile ; augmentation à deux unités, sous-total 16 000 FCFA ; retour depuis le checkout ; diminution à une unité sur ordinateur, sous-total 8 000 FCFA ; retrait de cette seule référence de test et état vide rétabli |
| Commande | Passage depuis le panier à 320 px ; même produit et quantité ; livraison fixe existante 1 500 FCFA, total 17 500 FCFA ; pays Canada et zone Montreal sélectionnables ; bouton de confirmation désactivé sans compte. Présentation sur ordinateur 1440 px également observée |
| Connexion | Présentation ordinateur et mobile 375 px ; soumission vide ramenant le focus au champ obligatoire, sans authentification ; lien vers inscription exercé |
| Inscription | Présentation ordinateur et mobile 375/320 px ; sections, champs et action finale accessibles par défilement ; aucune création de compte |
| Mot de passe oublié | Première étape affichée sur ordinateur et à 320 px ; champ et action lisibles ; aucun email ou changement de mot de passe |
| Mon compte / commandes | /profile redirige vers connexion avec callbackUrl conservé ; /profile/commandes fait de même en vue mobile ; aucun accès aux données connectées revendiqué |
| CGV | Cinq articles et sommaire sur ordinateur ; activation de Livraison en vue mobile 375 px : ancre #article-4 et article correspondant affichés ; texte légal inchangé |
| Pied de page | Présentation ordinateur et mobile 375 px ; liens des univers, compte, CGV, contacts et réseaux inspectés ; coordonnées, moyens de paiement et copyright visibles au bas de la page ; aucun contact externe lancé |
| WhatsApp | Parcours complet déjà validé immédiatement avant cet audit, sans changement de son code ; voir whatsapp-full-journey-preview.md et les comptes rendus liés. Aucun nouvel envoi pendant cette passe |

Aucun débordement gênant observé dans les vues inspectées après correction. Cela n’est pas une mesure automatique de toutes les largeurs et de tous les éléments du DOM. La sous-catégorie utilise encore sa présentation historique ; ce contrôle n’effectue pas une nouvelle refonte de cette page.

## Vérifications après correction sur la nouvelle Preview

- Accueil à 1440 px : message, recherche et téléphone entiers sur une seule ligne.
- Accueil à 768 px : message sur sa ligne, recherche et téléphone entiers sur la suivante. Capture enregistrée alors que le message long de livraison est actif. La rotation des trois visuels continue de fonctionner.
- Recherche saisie « baume » depuis le bandeau tablette corrigé : deux résultats reçus.
- Passage à 320 px : message lisible, recherche sous le logo, menu et devise présents, aucun débordement visible du bandeau.
- /checkout avec panier vide : état explicite, invitation à découvrir les soins et absence de confirmation.
- Fiche Huile de Barbe sur ordinateur : 6 791 FCFA après remise ; changement de devise donnant 12.08 USD, prix initial 14.21 USD ; retour en XOF confirmé.
- URL de catégorie inconnue : page 404 standard affichée, avec navigation du site. Le texte central reste le message anglais standard de Next ; amélioration éditoriale possible, sans blocage du parcours marchand.

## Contrôles techniques

- `node --test scripts/*.test.mjs` : 42/42 réussis. Calculs de prix et panier, stock, checkout, inscription, profil, récupération, slides et parcours WhatsApp couverts par les tests existants.
- `npx eslint .` : zéro erreur, trois avertissements existants (import inutilisé dans profile/layout et SencondFooter, image img du MetaPixel).
- Après la correction : ESLint ciblé Header et git diff --check réussis. Changement de disposition uniquement ; pas de modification de logique métier ni de nouveaux tests reproduisant du CSS.
- `npx tsc --noEmit --incremental false` : échec sur neuf erreurs déjà documentées avant cet audit : quatre conversions ObjectId/string dans ProductCarousel, quatre dans ProductSubcategory, une incompatibilité ReactNode/Promise dans lib/email/sendProductAvailable. Elles n’ont pas été corrigées par cette modification responsive. Le build de Preview f353b46 est néanmoins Ready selon Vercel ; il ne remplace pas un contrôle TypeScript réussi.

## Captures

- screenshots/site-audit-header-tablet-before.png : téléphone coupé à 768 px sur l’ancienne Preview.
- screenshots/site-audit-header-tablet-after.png : bandeau corrigé à 768 px, nouvelle Preview.
- screenshots/site-audit-checkout-mobile-320.png : récapitulatif réel avec deux Huile Locks, total 17 500 FCFA, confirmation désactivée.

Les captures sont produites par la vue adaptative, sans les onglets et autres applications du navigateur. Le petit bouton noir flottant est la barre de feedback Vercel, propre à la Preview.

## Limites et état final

Pas de session client disponible : profil connecté, commandes réelles, connexion réussie, validation email, récupération complète et succès après création de commande ne sont pas testés en situation réelle. Aucun compte créé, aucun achat, paiement, email ou message WhatsApp envoyé. Aucun catalogue ou réglage de base modifié. Les requêtes analytiques existantes lors des ajouts au panier et de l’ouverture du checkout restent celles du site.

Firefox seul utilisé ; Safari/Chrome, appareils physiques, clavier virtuel réel, lecteur d’écran, réseau lent et mesures de performance/Lighthouse non testés. Ce rapport ne valide ni le contenu juridique ni la disponibilité des services de paiement présentés.

Sur l’ancienne origine de contrôle, l’unique référence ajoutée a été retirée et le panier vide confirmé. La nouvelle Preview est laissée en XOF sans produit ajouté. Aucun changement de main/master, aucune fusion, aucun déploiement de production.
