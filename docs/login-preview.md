# Connexion — validation de la Preview

Périmètre : branche `refonte`, Preview Vercel uniquement. Aucun changement des fournisseurs d’authentification, des cookies, de la durée de session, du modèle utilisateur ou de la production.

Preview finale : https://yodi-store-788681fqx-a78zs-projects.vercel.app/connexion

Commit fonctionnel : `e70aa21`. Ajustement visuel pleine hauteur : `eb1fa49`, déploiement réussi en environnement `Preview`, `production_environment: false`. Les captures finales correspondent à cette dernière version.

## Présentation et comportement

La page reprend le fond ivoire, les titres Fraunces, les bordures fines et les boutons bruns des pages validées. Sur ordinateur, une introduction accompagne le formulaire ; sur mobile, le formulaire suit une introduction raccourcie. Aucun visuel ou service inventé n’a été ajouté.

Le formulaire utilise toujours `signIn("credentials", { email, password, redirect: false })` et redirige vers `/` en cas de succès. Les liens `/inscription` et `/mot-de-passe-oublie` sont conservés. La case « Se souvenir de moi », qui n’était reliée à aucune logique, a été retirée ; la durée de session existante reste inchangée.

Les champs ont des labels et des attributs d’autocomplétion. Le bouton d’affichage du mot de passe a un nom accessible dynamique et un état appuyé. Le formulaire et le bouton se désactivent pendant la requête, avec verrou contre les envois répétés. Les échecs de connexion et de réseau ont un message dans la page, avec focus, sans afficher les erreurs brutes. Le mot de passe n’est ni normalisé ni stocké par le composant.

## Contrôles

- ESLint ciblé réussi ; 14 tests de régression existants réussis. TypeScript ne signale aucune erreur dans les fichiers modifiés ; les 12 erreurs préexistantes hors périmètre restent présentes.
- Preview fonctionnelle testée : https://yodi-store-5cf908zo8-a78zs-projects.vercel.app/connexion (`e70aa21`), déploiement réussi, environnement `Preview`, `production_environment: false`.
- Soumission vide : focus sur le champ email obligatoire, sans connexion.
- Email mal formé : validation native, focus sur l’email.
- Afficher puis masquer un mot de passe fictif : type de champ et état accessible du bouton vérifiés.
- Une tentative d’authentification avec une adresse réservée en `.invalid` et un mot de passe fictif : message d’échec visible, focus sur le message, champs et bouton à nouveau disponibles.
- Aucune proposition d’enregistrement des identifiants fictifs acceptée.
- Lien de récupération : arrivée sur le formulaire de demande de code, puis retour à la connexion. Aucun code demandé et aucun email envoyé.
- Lien d’inscription : arrivée sur le formulaire de création, puis retour à la connexion. Aucun formulaire d’inscription rempli ou soumis.
- Contrôle visuel à 1280, 375 et 320 px. Pas de débordement du formulaire sur le petit écran. Captures issues de l’interface réelle, avec champs vides ; le bouton flottant noir appartient à la barre Vercel de Preview.

## Limites

Aucun compte client réel utilisé et aucune connexion réussie effectuée. La redirection après succès et le cas d’erreur réseau ont été relus dans le code. Aucun utilisateur, commande, produit ou paiement créé ou modifié ; pas de réinitialisation de mot de passe. L’authentification par identifiants utilise les lectures de compte existantes, sans adaptateur de persistance de session en base ajouté.

## Captures

- `screenshots/login-desktop.png`
- `screenshots/login-mobile-375.png`
- `screenshots/login-mobile-320.png`
