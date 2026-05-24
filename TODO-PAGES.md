# TODO — Pages à créer (référencées mais inexistantes)

Plusieurs sections (footer, trust bar) prévoient des liens vers des pages qui
**n'existent pas encore**. Pour éviter les 404 en production, ces liens ont été
**volontairement omis** (ou laissés en commentaire `// TODO`) en attendant la
création des pages. Voici la liste à traiter dans une étape dédiée.

## Pages d'information à créer
| Page | Route prévue | Priorité | Utilisée par |
|---|---|---|---|
| À propos de Yodi-K | `/about` (ou `/a-propos`) | Haute | Footer (Aide), trust bar "100% Naturel" |
| Livraison & délais | `/livraison` | Haute | Footer (Aide), trust bar "Livraison Express" |
| Moyens de paiement | `/paiement` | Moyenne | Footer (Aide), trust bar "Paiement" |
| Nous contacter | `/contact` | Moyenne | Footer (Aide) — *en attendant : lien WhatsApp actif* |
| FAQ | `/faq` | Moyenne | Footer (Aide) |
| Politique de retour | `/retour` | Moyenne | Footer (Aide) |
| Mentions légales | `/mentions-legales` | Haute (légal) | Footer (barre légale) |
| Politique de confidentialité | `/confidentialite` | Haute (RGPD) | Footer (barre légale) |
| Politique cookies | `/cookies` | Moyenne | Footer (barre légale) |

## Déjà existantes (liées et fonctionnelles)
- CGV → `/condition-dutilisations` ✅
- Mon compte → `/profile` ✅
- Catégories → `/tisane`, `/savon`, `/huile/*`, `/baume/*`, etc. ✅ (route dynamique)
- Contact → lien **WhatsApp** actif (`wa.me/221789689698`) en attendant `/contact`

## Comment activer un lien une fois la page créée
Dans `components/SencondFooter.tsx`, des blocs `// TODO` indiquent où ajouter les
`<Link>` correspondants (colonne « Aide & infos » et barre légale).

## Page /categories — catégories à vérifier (contenu produits)
La page `/categories` liste 9 catégories. Les **6 premières** ont une image et des produits.
Les **3 dernières** (Gomme à lèvres, Bain & Corps, Bébé & Maman) :
- N'ont **pas d'image** dans `/public/categories/` → affichées avec une carte icône/dégradé.
- Leur route existe (route dynamique `/[category]`) mais elles **n'ont peut-être pas encore de produits** → page catégorie potentiellement vide.
- **À confirmer avec le propriétaire** : si vides, soit ajouter des produits (admin), soit les marquer « Bientôt disponible » (non cliquables), soit les masquer. Elles sont déjà liées dans le menu existant.

## Page "Tous les produits"
La page `/produits` (CTA "Voir tous nos produits" du brief) **n'existe pas** → non câblée.
Remplacée sur /categories par "Retour à l'accueil" + "Nous contacter (WhatsApp)". À créer si besoin d'un catalogue global.

## Newsletter (séparé)
Le bloc newsletter du footer est **désactivé** (commenté) : il nécessite un backend
de stockage des emails (modèle « abonnés » + route `/api/newsletter`, sur le modèle
de la liste d'attente de l'Étape 2). À traiter dans une étape dédiée.
