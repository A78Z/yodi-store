# Mot de passe oublié — validation de la Preview

Périmètre : branche `refonte`, Preview Vercel uniquement. Aucune modification des API, de l’authentification, des emails ou de la production.

Preview finale : https://yodi-store-1jhku1bc0-a78zs-projects.vercel.app/mot-de-passe-oublie

Commit fonctionnel : `0515e50`. Texte de retour raccourci pour petit écran : `0cd2a97`, déploiement réussi en environnement `Preview`, `production_environment: false`. Les captures finales correspondent à cette version.

## Présentation et parcours

La page réutilise les styles de connexion validés, sans modifier leur fichier : fond ivoire, titres Fraunces, carte blanche et bouton brun. Le parcours est présenté en deux étapes : demande du code email, puis code et nouveau mot de passe. La première étape reste compacte sur mobile.

Les contrats restent identiques : `POST /api/forgot-password` avec l’email, puis `POST /api/reset-password` avec l’email ayant reçu le code, le code et le mot de passe. Le minimum reste de six caractères et les mots de passe doivent correspondre. Le code est limité à six chiffres ; il reste une chaîne pour conserver les zéros initiaux. Le mot de passe n’est pas normalisé et sa confirmation n’est pas envoyée.

Labels, autocomplétion, saisie numérique du code, boutons d’affichage indépendants et focus des erreurs sont prévus. Un verrou et les états de chargement protègent les requêtes contre les clics répétés. Les messages d’échec se trouvent dans la page. Après succès, les champs sensibles sont effacés et la redirection vers `/connexion` reste différée de deux secondes ; le minuteur est nettoyé au démontage.

Comme auparavant, le renvoi revient au formulaire email, puis requiert un clic sur « Envoyer le code ». L’adresse est préservée, le code et les mots de passe sont effacés, et une indication explique cette étape. Le retour à la connexion reste accessible.

## Contrôles effectués

- ESLint ciblé réussi ; 20 tests automatisés réussis. Trois nouveaux tests couvrent le code exact à six chiffres avec zéros initiaux, le minimum/confirmation du mot de passe et le contrat des données sans confirmation ni champ supplémentaire.
- TypeScript : aucune erreur dans les fichiers modifiés ; les 12 erreurs préexistantes hors périmètre subsistent.
- Preview fonctionnelle : https://yodi-store-69lxft023-a78zs-projects.vercel.app/mot-de-passe-oublie (`0515e50`), déploiement réussi, environnement `Preview`, `production_environment: false`.
- Soumission vide : message natif obligatoire et focus sur l’email.
- Email fictif mal formé : validation native, maintien du focus sur l’email, sans demande de code.
- Lien « Se connecter » : arrivée sur la connexion validée, puis retour via « Mot de passe oublié ? » avec formulaire vide.
- Contrôle visuel à 1280, 375 et 320 px. Le formulaire reste dans le cadre, les contrôles et liens sont accessibles. Captures de la Preview réelle ; le bouton flottant noir appartient à Vercel.

## Limites des essais

Aucun email valide soumis, aucune demande de code, aucun renvoi et aucune réinitialisation effectués. Aucun compte ou mot de passe modifié en base. La seconde étape, les erreurs de serveur/réseau et le succès final ont été relus dans le code ; leurs appels ne sont pas exécutés dans le navigateur. Les validateurs purs sont couverts par les tests automatisés.

## Captures

- `screenshots/password-recovery-desktop.png`
- `screenshots/password-recovery-mobile-375.png`
- `screenshots/password-recovery-mobile-320.png`
