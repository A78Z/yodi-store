# Mon compte — refonte en Preview

Périmètre : branche `refonte` exclusivement. Aucun changement d’API, de base, d’authentification ou de production.

Preview finale : https://yodi-store-glg8gn5h6-a78zs-projects.vercel.app/profile

Commit fonctionnel : `5707d2c`. Déploiement `2NJaRGweDyiCNmG9aAHneNEyHzUh`, statut réussi, environnement `Preview`, `production_environment: false`. Une première compilation a échoué dans la résolution de la police Google Josefin Sans par Turbopack (fichier inchangé). La recompilation du même commit sans cache a réussi, sans changement de configuration.

## Présentation

La route `/profile` reprend la direction Maison Yodi-K : fond ivoire, cartes blanches, titres Fraunces, texte DM Sans, séparateurs sable et actions brunes. Une colonne rassemble les coordonnées, leur modification et la déconnexion ; l’autre présente les statistiques et le suivi de la dernière commande. Le lien vers `/profile/commandes` reste disponible. La grille passe sur une colonne sur petit écran ; les champs de la fenêtre d’édition s’empilent également.

Le formulaire conserve les sept coordonnées modifiables et les contrats PATCH existants. Les mots de passe sont facultatifs, avec trois champs requis ensemble, six caractères minimum et confirmation identique. Seuls les champs autorisés partent à l’API ; les mots de passe ne sont plus recopiés dans l’état du profil. Ils sont effacés à la fermeture et après succès. Verrou de requête, états occupés, labels associés, autocomplétion, description des fenêtres et focus des erreurs sont prévus. Le focus des fenêtres est géré par Radix, avec déclencheurs et fermetures explicites.

La suppression nécessite maintenant une confirmation distincte, avec « Conserver mon compte » comme première action. L’API existante supprime l’utilisateur ; aucune promesse de suppression des commandes associées n’est ajoutée. Les erreurs restent visibles dans la fenêtre.

## Exactitude des données

- Statistiques lues via `/api/order/getstats`, sans modifier son calcul : somme de `total * valueCurrency`, en FCFA, tous statuts confondus. L’ancien montant « livré », estimé par proportion du nombre de commandes, a été retiré. Le montant est nommé « Montant des commandes », avec mention explicite des annulations incluses.
- Suivi lu via `/api/order/last`. L’ordre devient attente → préparation → livraison. Une annulation est affichée séparément et ne marque plus la livraison comme accomplie. Les statuts inconnus n’inventent aucune progression.
- Un échec des statistiques ne devient pas un faux zéro. Un échec du suivi est distingué de l’absence de commande (404). Une erreur du profil offre une nouvelle tentative.
- Protection de `/profile` et redirection vers la connexion conservées. Les chargements sont annulés au démontage.

## Vérifications

- ESLint ciblé réussi.
- 23 tests automatisés réussis, dont trois nouveaux tests couvrant la progression des commandes, les règles du changement facultatif de mot de passe, et la séparation entre données du profil et identifiants sensibles.
- TypeScript : aucune erreur dans les fichiers ajoutés ou modifiés ; les 12 erreurs préexistantes hors périmètre restent présentes.
- Accès invité contrôlé dans Firefox sur les Previews `be1d1a0` et finale `5707d2c` : `/profile` redirige vers `/connexion` avec l’URL de retour.

## Limites

Aucune session client disponible dans l’onglet de contrôle pendant les essais. L’affichage connecté, les fenêtres, leur navigation clavier et les largeurs ordinateur/mobile ont été relus dans le code, mais ne sont pas validés visuellement dans le navigateur. Aucune capture du tableau de bord connecté n’est présentée comme preuve. Aucun contournement d’authentification, compte fictif ou route publique de démonstration ajouté.

Aucun profil, mot de passe, compte ou commande modifié pendant les essais ; aucune suppression, inscription ou déconnexion client déclenchée. Aucune donnée personnelle publiée dans le dépôt public. Les appels d’écriture et leurs réponses de succès/erreur ne sont pas exécutés dans le navigateur.

Fichiers : `app/profile/page.tsx`, `app/profile/page.module.css`, `lib/profile.ts`, `scripts/profile.test.mjs`.
