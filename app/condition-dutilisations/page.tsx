import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, ChevronRight, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conditions générales de vente | Yodi-K",
  description: "Consultez les conditions générales de vente de la boutique Yodi-K.",
  alternates: { canonical: "/condition-dutilisations" },
};

const ARTICLES = [
  ["article-1", "Présentation du Site internet"],
  ["article-2", "Acceptation des CGV"],
  ["article-3", "Disponibilité"],
  ["article-4", "Livraison"],
  ["article-5", "Moyen de Paiement"],
];

export default function ConditionDutilisations() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav aria-label="Fil d’Ariane" className={styles.breadcrumb}><ol><li><Link href="/">Accueil</Link></li><li><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">Conditions générales de vente</span></li></ol></nav>
        <header className={styles.heading}>
          <p className={styles.eyebrow}><span aria-hidden="true" />Maison Yodi-K · Informations</p>
          <h1>Conditions générales <em>de vente</em></h1>
          <p className={styles.intro}>Site internet www.yodi-k.com</p>
        </header>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <nav aria-labelledby="cgv-summary" className={styles.summary}>
              <p className={styles.summaryEyebrow}>Les 5 articles</p>
              <h2 id="cgv-summary">Dans cette page</h2>
              <ol>{ARTICLES.map(([id, title], index) => <li key={id}><a href={`#${id}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{title}</a></li>)}</ol>
            </nav>
          </aside>
          <div className={styles.document}>
<article id="article-1" aria-labelledby="article-1-title" className={styles.article}>
            <h2 id="article-1-title">
              Article 1 – Présentation du Site internet
            </h2>
            <p>
              yodi-store est une boutique en ligne spécialisée dans la vente de
              produits de beauté, maquillage, de parfums, de produits
              d&apos;hygiène et beauté et d&apos;accessoires divers pour
              cheveux, visage et corps pour Homme et Femme. Le Site offre
              également des gammes diverses comme les produits intimes.
            </p>
          </article>
<article id="article-2" aria-labelledby="article-2-title" className={styles.article}>
            <h2 id="article-2-title">
              Article 2 – Acceptation des CGV
            </h2>
            <div>
              <p>
                Les présentes Conditions Générales de Vente (ci-après dénommées
                « CGV ») régissent les règles de vente et d&apos;achat des produits
                mis en vente sur internet par le site internet «{" "}
                <span>
                  https://www.yodi-k.com
                </span>{" "}
                » (ci-après dénommé « yodi-store»). Les CGV ne concernent à
                titre exclusif que les personnes physiques non commerçantes.
              </p>
              <p>
                Les CGV définissent les étapes nécessaires à la passation de la
                commande, de l&apos;achat et permettent de suivre
                l&apos;acheminement de chaque commande conclue, à
                l&apos;exclusion de toute autre convention présente ou non sur
                le Site.
              </p>
              <p>
                Les présentes CGV doivent obligatoirement être acceptées lors de
                tout achat effectué sur le Site. Seules les personnes physiques
                non commerçantes sont autorisées à effectuer des achats sur le
                Site. Tous les achats effectués sur le Site sont conclues à
                titre non professionnel.
              </p>
            </div>
          </article>
<article id="article-3" aria-labelledby="article-3-title" className={styles.article}>
            <h2 id="article-3-title">
              Article 3 – Disponibilité
            </h2>
            <div>
              <p>
                Les offres présentées par yodi-store sont valables tant qu&apos;elles
                sont annoncées sur le Site et dans la limite des stocks
                disponibles.
              </p>
              <p>
                En tout état de cause, et dans l&apos;éventualité d&apos;une
                indisponibilité totale ou partielle de produits après passation
                de la Commande, l&apos;Acheteur sera informé par téléphone dès que
                possible de l&apos;indisponibilité du produit et de l&apos;annulation
                totale ou partielle de sa commande.
              </p>
              <p>
                En cas d&apos;annulation totale de la Commande :
              </p>
              <ul>
                <li>
                  La Commande de l&apos;Acheteur sera automatiquement annulée et le
                  montant payé sera rembourser sans frais.
                </li>
                <li>
                  Le Service Clients de yodi-store prendra contact avec
                  l&apos;Acheteur pour l&apos;informer de l&apos;annulation de sa Commande et
                  lui proposer de renouveler sa Commande, à l&apos;exception du
                  produit non disponible.
                </li>
              </ul>
            </div>
          </article>
<article id="article-4" aria-labelledby="article-4-title" className={styles.article}>
            <h2 id="article-4-title">
              Article 4 – Livraison
            </h2>
            <div>
              <p>
                Au cours de la validation de chaque commande, l&apos;acheteur
                concerné doit obligatoirement choisir la Zone de livraison de sa
                commande. Ces Zones de livraison sont affichées sur le Site lors
                de la validation de la commande.
              </p>
              <div className={styles.callout}>
                <p>
                  Le délai de livraison est de moins de 24h dans la région de
                  Dakar et 72h dans les autres régions.
                </p>
                <p>
                  Hors dimanche et jours fériés.
                </p>
              </div>
            </div>
          </article>
<article id="article-5" aria-labelledby="article-5-title" className={styles.article}>
            <h2 id="article-5-title">
              Article 5 – Moyen de Paiement
            </h2>
            <div>
              <p>
                L&apos;acheteur aura le choix de payer en espèces lors de la
                livraison, par carte bancaire ou par Orange Money lors de la
                validation de la commande.
              </p>
              <div className={styles.callout}>
                <p>
                  Pour tous les paiements en ligne, le Site n&apos;accèdent et ne
                  conservent aucune donnée bancaire, seuls les organismes de
                  paiement y ayant accès.
                </p>
              </div>
              <p>
                Chaque acheteur concerné est seul et entier responsable des
                éventuelles autorisations nécessaires autant dans le choix du
                mode de paiement qu&apos;au règlement de sa commande.
              </p>
            </div>
          </article>
            <footer className={styles.documentFooter}>
              <p>Consulté le {new Date().toLocaleDateString("fr-FR")}</p>
              <a href="#article-1">Revenir au premier article<ArrowUpRight size={15} aria-hidden="true" /></a>
            </footer>
          </div>
        </div>
        <section className={styles.contact} aria-labelledby="cgv-contact">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true" />À votre écoute</p>
            <h2 id="cgv-contact">Une question <em>sur ces conditions&nbsp;?</em></h2>
            <p>Pour toute question concernant ces conditions, contactez-nous à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </div>
          <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}><Mail size={17} aria-hidden="true" />Nous écrire<span className="sr-only"> à {CONTACT_EMAIL}</span><ArrowUpRight size={16} aria-hidden="true" /></a>
        </section>
        <Link href="/" className={styles.back}>Retour à l’accueil<ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
    </main>
  );
}
