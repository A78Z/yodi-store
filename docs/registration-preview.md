# Inscription — validation de la Preview

Périmètre : `refonte`, Preview Vercel uniquement. Aucune modification de l’API d’inscription, des modèles de compte/vérification, des emails, de l’authentification ou de la production.

Preview vérifiée : https://yodi-store-hok7gho4d-a78zs-projects.vercel.app/inscription

Commit fonctionnel : `a7f441a`, complété par `ac3006b` pour le focus initial du code. Déploiement réussi en environnement `Preview`, `production_environment: false`.

## Présentation et parcours

La page reprend les couleurs ivoire et brun, les titres Fraunces et la carte de connexion validée. Les champs sont regroupés en trois sections : coordonnées, adresse, mot de passe. Les informations présentées à gauche sur ordinateur sont raccourcies sur mobile. Le fond couvre la hauteur de l’écran.

Les champs attendus par `/api/register` sont conservés. Le code postal et le pays restent facultatifs ; les options et valeurs « Sénégal » / « Canada » restent identiques. Le minimum du mot de passe reste de six caractères, avec confirmation identique. Les données de contact sont nettoyées de leurs espaces extérieurs ; le mot de passe est conservé exactement et la confirmation n’est pas envoyée.

Labels, autocomplétion, validation native et focus des erreurs sont prévus. Chaque mot de passe a son bouton d’affichage indépendant, nommé et doté d’un état accessible. Les requêtes et boutons sont protégés contre les clics simultanés.

Le parcours existant est conservé : `/api/register`, puis saisie du code via `/api/verify`, ou renvoi via `/api/resend-code`, puis redirection vers `/connexion` après vérification. La fenêtre reprend le style visuel, conserve le piège de focus Radix et place le focus sur le code à son ouverture. Le code reste une chaîne de six chiffres, avec conservation des zéros initiaux.

Après réception de la réponse d’inscription, les mots de passe sont effacés de l’état du formulaire. La vérification peut être rouverte après fermeture sans soumettre à nouveau l’inscription. Les messages de renvoi et d’erreur sont affichés dans la fenêtre concernée. Le minuteur de redirection est nettoyé au démontage.

## Contrôles effectués

- ESLint ciblé réussi ; 17 tests automatisés réussis. Trois nouveaux tests vérifient le minimum/confirmation du mot de passe, le contrat de données sans confirmation ni champ supplémentaire et le code à six chiffres avec zéros initiaux.
- TypeScript : aucune erreur dans les fichiers modifiés ; les 12 erreurs préexistantes de recherche, anciens carrousels et email restent hors périmètre.
- En Preview, soumission du formulaire vide : message natif obligatoire et focus sur le prénom.
- Saisie de coordonnées entièrement fictives et de deux mots de passe différents : email mal formé bloqué par la validation native ; avec une adresse en `.invalid`, erreur locale « Les mots de passe ne correspondent pas. » avec focus, avant tout appel d’inscription.
- Affichage puis masquage indépendant des deux mots de passe fictifs : types des champs et états des boutons vérifiés.
- Aucun enregistrement des identifiants fictifs dans Firefox accepté.
- Lien vers la connexion vérifié, puis retour via « Créer un compte » pour retrouver un formulaire vide.
- Contrôle visuel à 1280, 375 et 320 px. Les trois sections et les boutons restent dans le cadre sur petit écran. Captures de la Preview réelle, champs vides ; le bouton flottant noir appartient à Vercel.

## Limites des essais

Aucune inscription valide soumise, aucun compte ni enregistrement de vérification créé, aucun email envoyé ou code renvoyé. Les états de réponse serveur, la fenêtre de vérification, le renvoi et le succès final ont été relus dans le code sans exécuter les appels qui écrivent en base. Les validateurs purs sont couverts par les tests ; les essais dans le navigateur restent volontairement limités aux validations locales et à la navigation.

## Captures

- `screenshots/registration-desktop.png`
- `screenshots/registration-mobile-375.png`
- `screenshots/registration-mobile-form.png` et `screenshots/registration-mobile-end.png` : extraits du même viewport étendu à 375 px.
- `screenshots/registration-mobile-320.png`
