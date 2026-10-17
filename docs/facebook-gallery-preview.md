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
