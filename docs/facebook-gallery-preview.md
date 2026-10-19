# Galerie Facebook — préparation en Preview

## État au 17 octobre 2026

**Préparée, synchronisation non activée.** Aucun accès API autorisé à la Page n’a pu être établi. La galerie est donc masquée sans espace réservé ; aucune liste statique ni image de démonstration n’est présentée aux visiteurs.

- Branche : `refonte` ; code : `b78940a`.
- Preview Vercel Ready : https://yodi-store-nrmzbmzfk-a78zs-projects.vercel.app
- Déploiement : https://vercel.com/a78zs-projects/yodi-store.com/CRTmjjEyBAnwaaBWwcZwvEfudorg
- Page officielle déjà configurée dans le site : https://www.facebook.com/yyodistores
- Le bloc conseil reste intact ; le composant se place entre celui-ci et le pied de page sombre.

## Accès manquant

La consultation publique de la Page a montré des publications photo, dont une publicité Huile Locks et une mise à jour de photo de profil. Cela ne constitue pas un accès autorisé à son flux API. Aucun média Facebook n’a été exporté ou substitué par une image locale.

L’ouverture de « Mes applications » dans la session Meta disponible redirige vers l’inscription « Créer un compte Meta for Developers ». Aucune application accessible n’y a été identifiée. L’inscription demande l’acceptation des conditions Meta ; elle a été annulée sans acceptation. Cela ne prouve pas qu’aucune application n’existe sous un autre compte.

La prochaine étape nécessite le compte qui administre effectivement `yyodistores`, puis une application disposant d’un accès de lecture autorisé aux publications de cette Page. Le jeton publicitaire CAPI existant ne sert pas de remplacement. Les variables Facebook nécessaires sont absentes des réglages Vercel inspectés.

À configurer côté serveur dans Vercel, portée **Preview, branche refonte uniquement**, une fois l’accès obtenu :

- `FACEBOOK_PAGE_ID` : identifiant numérique de la Page officielle, à confirmer avec la réponse API.
- `FACEBOOK_PAGE_ACCESS_TOKEN` : jeton de Page autorisé à lire ses publications (`pages_read_engagement` ; accès supplémentaire éventuel selon le statut de l’application). Ne pas le communiquer dans le chat ou le dépôt.
- `FACEBOOK_GRAPH_API_VERSION` : facultatif, défaut `v26.0`.

La découverte des Pages peut demander `pages_show_list`. Aucune permission de publication ou d’administration n’est nécessaire à la galerie. Les conditions exactes et le statut de l’application doivent être confirmés dans Meta. Après ajout sécurisé des variables, redéployer la Preview et tester la réponse réelle, notamment l’identité de Page et ses pièces jointes.

Documentation officielle consultée : https://developers.facebook.com/documentation/pages-api/posts . La récupération préparée utilise l’arête `published_posts` ; sa disponibilité et les champs doivent encore être validés avec un vrai accès de Page.

## Implémentation préparée

Récupération serveur uniquement, vérification de l’identité de la Page, trois lots de douze publications maximum, vingt-quatre médias maximum, cache serveur de cinq minutes et délai maximal de six secondes. Les jetons passent uniquement dans l’en-tête Authorization et ne sont ni renvoyés au navigateur ni journalisés. Les URL de pagination reçues de Meta ne sont pas suivies directement.

Normalisation des pièces jointes photo/vidéo et des albums, dédoublonnage, exclusion des publications textuelles et aperçus de liens. Erreur réseau, refus d’accès ou flux vide : galerie masquée. Une vignette expirée ou introuvable est retirée du rendu ; le prochain rafraîchissement serveur renouvelle le flux.

Deux rangées de cartes 4:5, images non recadrées, largeur 260 px sur ordinateur et 190 px sur mobile. Avec au moins dix médias, boucles opposées à 30 px/s, pause au survol/focus et commande accessible. Copies ignorées des technologies d’assistance et hors tabulation. Peu de médias, tactile ou réduction des mouvements : consultation manuelle statique.

Les vidéos ouvrent explicitement leur publication Facebook d’origine après clic ; aucun lecteur intégré ni lecture automatique n’est annoncé. Les photos ouvrent également leur publication dans un nouvel onglet sécurisé.

## Vérifications et limites

- Tests Node : 49/49 réussis, dont sept nouveaux tests de normalisation, configuration, pagination et erreurs. Les fixtures synthétiques restent exclusivement dans les tests ; elles n’alimentent jamais la galerie.
- ESLint ciblé et `git diff --check` : réussis.
- TypeScript : les neuf erreurs préexistantes du projet persistent, aucune nouvelle erreur de galerie relevée.
- Vercel : Preview Ready pour `b78940a`.
- Navigateur : nouvelle URL chargée, accueil et bloc conseil/pied de page présents, galerie absente comme prévu sans configuration.

**Non vérifiés avec des médias réels :** apparence mobile/ordinateur de la galerie, jonction des boucles, pause, tactile, réduction des mouvements, liens photo/vidéo et renouvellement des URL Meta. Aucune capture de galerie fonctionnelle n’est fournie, puisque le flux autorisé manque. Cette partie ne peut être déclarée terminée avant connexion et contrôles réels.

Aucune écriture dans la base, aucune modification de production, du panier, du checkout, des paiements, des emails ou de l’administration.

## Changement de demande : galerie provisoire du site

Le client a demandé de mettre les cartes en place en attendant, puis de permettre la publication de photos et vidéos depuis l’admin. Cette demande remplace la dépendance obligatoire à Facebook pour la galerie provisoire.

L’accueil de la Preview refonte utilise désormais les photos réelles des produits déjà chargés, sans requête supplémentaire ni écriture dans la base. Les photos identiques et le logo de remplacement sont exclus. Chaque carte ouvre la fiche produit dans le même onglet. Le nom accessible devient « La galerie des soins Yodi-K » : aucune origine Facebook n’est revendiquée. La connexion Meta préparée reste inactive.

Le composant générique `HomeMediaGallery` conserve les deux rangées, les dimensions réservées, le rendu intégral des images, la pause et le mode manuel sur tactile/réduction des mouvements. Avec moins de dix photos, la galerie reste statique et consultable horizontalement.

L’admin est un autre dépôt, identifié par `ADMIN_URL=https://admin.yodi-k.com` et `ADMIN_HANDOFF.md`. Ce frontend n’a ni rôle administrateur ni système d’upload. Le dossier ou dépôt de cet admin a été demandé afin d’ajouter la gestion des médias avec son authentification et son stockage existants. Aucun faux bouton de publication ni route d’administration publique n’a été ajouté à la boutique.

Validation locale : ESLint ciblé et diff check réussis ; TypeScript conserve les neuf erreurs préexistantes. La vérification visuelle des cartes sur Preview reste à effectuer après déploiement.

### Vérification de la galerie provisoire

- Code déployé : `d74db0f` ; Preview chargée : https://yodi-store-rnde09x2g-a78zs-projects.vercel.app/#pied-de-page .
- Six cartes réelles observées en deux rangées, après le bloc conseil et avant le footer sombre ; photos chargées et présentées intégralement.
- Rendu ordinateur et Firefox adaptatif 375 × 844 contrôlés visuellement. La galerie reste contenue dans la page ; les rangées sont consultables horizontalement. Six photos ne déclenchent pas de boucle automatique.
- Clic sur la carte Chantily Glow Skin : fiche produit correspondante chargée dans le même onglet, titre et URL vérifiés.
- 49/49 tests Node réussis. Aucun média vidéo n’a été ajouté ; la publication depuis l’admin attend toujours l’accès à son dépôt et à son stockage.

## Gestion manuelle depuis le dépôt admin

Le dépôt `A78Z/yodiadmin` a été fourni pour ajouter la page de publication. La boutique est préparée pour lire la collection isolée `yodi_gallery_preview_refonte` dans la base existante, en lecture seule, uniquement en Preview refonte. La variable serveur `GALLERY_BLOB_HOST` doit être identique au stockage public connecté à l’admin. Aucun jeton Blob d’écriture n’est requis dans la boutique.

Le flux publié remplace les photos catalogue uniquement s’il contient des médias valides. Les vignettes et fichiers doivent appartenir au stockage explicitement configuré et au préfixe `gallery/refonte/`. Seuls les médias marqués publiés sont transmis aux visiteurs, au maximum 24 ; cache 60 secondes.

Les nouveaux médias ouvrent une fenêtre accessible avec fermeture, retour du focus et pause des rangées. Les vidéos utilisent un lecteur natif, `preload=none`, contrôles et aucune lecture/son automatiques ; le lecteur est démonté à la fermeture. Les photos s’ouvrent en grand sans recadrage. Les cartes catalogue de repli conservent leurs liens produits.

Validation : 52 tests Node réussis, ESLint ciblé sans erreur ; erreurs TypeScript existantes inchangées. L’activation et le test complet avec un vrai fichier attendent le stockage Vercel Blob de la Preview admin et l’adresse du compte autorisé. Aucun envoi/publication n’est déclaré validé à ce stade.

## Stockage manuel configuré — 17 octobre 2026

L’utilisateur a autorisé la création du stockage public dédié `yodi-gallery-refonte`. Son domaine public est `uqatabojauagou1s.public.blob.vercel-storage.com` ; `GALLERY_BLOB_HOST` a été enregistré côté boutique avec portée exclusive `refonte`, vérifiée dans Vercel. Aucun jeton d’écriture Blob n’est transmis à la boutique ni versionné.

Côté admin, le jeton Blob et le compte de publication autorisé ont été configurés comme secrets serveur sur la seule branche Preview `refonte`. Les fichiers restent publics une fois envoyés au stockage. Aucun média n’a été envoyé ni publié pendant la configuration. Une nouvelle Preview est déclenchée pour charger les variables. Le test réel d’envoi/publication attend une session administrateur et un média choisi par l’utilisateur.

Les deux Previews configurées ont été redéployées avec succès (`8407081` pour l’admin et `7bae440` pour la boutique). Le compte autorisé a pu ouvrir le formulaire admin après rechargement complet, avec sélection de fichier active et galerie vide. L’interface a été contrôlée sur ordinateur et à 375 × 844. Aucun fichier n’a été envoyé pour ce contrôle ; le premier envoi et sa lecture attendent un média choisi par l’utilisateur.

### 17 octobre — visuels fournis et rangées complètes

Les onze photos jointes par Yodi-K remplacent les anciennes photos du catalogue dans la galerie Preview. Copies JPEG optimisées (2,3 Mo au total), sans recadrage, dans `public/gallery/refonte`. Les publications admin sont prioritaires, puis les visuels fournis complètent douze cartes : six par rangée. En l’absence de publication admin, le premier visuel est repris une fois pour remplir la douzième carte. Les deux boucles continues fonctionnent en sens opposés sur ordinateur et mobile ; pause accessible, pause au focus/survol et préférence de réduction des animations conservées. Six cartes visibles sur les écrans larges, défilement de cartes lisibles sur mobile.

Contrôle initial de l’admin connecté : « Vos médias (0) », aucune publication retrouvée malgré la photo signalée. Aucun document ni média admin modifié. Deux tests vérifient les rangées complètes et la priorité des publications.
