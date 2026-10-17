import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, ChevronRight, MessageCircle, Package, Search } from "lucide-react";
import { SITE_URL, WHATSAPP } from "@/lib/site";
import { getVisibleUnivers } from "@/lib/catalog";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Toutes nos catégories | Yodi-K",
  description: "Découvrez nos catégories de cosmétiques naturels et de parapharmacie disponibles en ligne.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  let unavailable = false;
  const univers = await getVisibleUnivers().catch((error) => {
    console.error("Error fetching visible categories:", error);
    unavailable = true;
    return [];
  });

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav aria-label="Fil d’Ariane" className={styles.breadcrumb}><ol><li><Link href="/">Accueil</Link></li><li><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">Catégories</span></li></ol></nav>
        <header className={styles.heading}>
          <p className={styles.eyebrow}><span aria-hidden="true" />Maison Yodi-K · La boutique</p>
          <h1>Toutes nos <em>catégories</em></h1>
          <p className={styles.intro}>Une envie, un geste, un moment pour vous. Explorez nos univers et trouvez votre prochain soin.</p>
        </header>

        <section aria-labelledby="univers-heading" className={styles.catalog}>
          <div className={styles.catalogHeader}>
            <h2 id="univers-heading">À chacun <em>son rituel.</em></h2>
            {univers.length > 0 && <p>{univers.length} univers à découvrir</p>}
          </div>
          {univers.length > 0 ? <ul className={styles.grid}>
            {univers.map((universe, index) => (
              <li key={universe.slug}>
                <Link href={`/${universe.slug}`} className={styles.card}>
                  <div className={styles.visual}>
                    {universe.imageUrl && universe.imageUrl !== "/logo-yodi-k.png" ? <Image
                      src={universe.imageUrl} alt="" fill priority={index === 0}
                      sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1264px) 32vw, 384px"
                      className={styles.photo}
                    /> : <span className={styles.fallback}><Package size={36} strokeWidth={1.2} aria-hidden="true" />Découvrez cet univers</span>}
                    <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className={styles.content}>
                    <div>
                      <p className={styles.count}>{universe.productCount} produit{universe.productCount !== 1 ? "s" : ""}</p>
                      <h3>{universe.title}</h3>
                      <span className={styles.invitation}>Explorer l’univers</span>
                    </div>
                    <span className={styles.arrow} aria-hidden="true"><ArrowRight size={20} strokeWidth={1.4} /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul> : <div className={styles.empty}>
            <span className={styles.stateIcon}><Package size={30} strokeWidth={1.3} aria-hidden="true" /></span>
            <h3>{unavailable ? "Les univers prennent un instant." : "Aucun univers à afficher pour le moment."}</h3>
            <p>{unavailable ? "Nous n’avons pas pu charger les catégories. Vous pouvez réessayer dans un instant." : "Vous pouvez nous contacter pour être accompagné dans votre recherche."}</p>
            {unavailable && (
              // eslint-disable-next-line @next/next/no-html-link-for-pages -- Relire le serveur après erreur exige un rechargement complet.
              <a href="/categories" className={styles.primary}>Réessayer<ArrowRight size={16} aria-hidden="true" /></a>
            )}
          </div>}
        </section>

        <section aria-labelledby="categories-help" className={styles.advice}>
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true" />À votre écoute</p>
            <h2 id="categories-help">Un soin en tête, <em>une question ?</em></h2>
            <p>Retrouvez un produit par son nom ou échangez avec nous pour trouver votre prochain rituel.</p>
          </div>
          <div className={styles.adviceActions}>
            <Link href="/recherche" className={styles.primary}><Search size={17} aria-hidden="true" />Rechercher un soin</Link>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className={styles.contact}><MessageCircle size={17} aria-hidden="true" />Demander conseil<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> sur WhatsApp (nouvel onglet)</span></a>
          </div>
        </section>
        <Link href="/" className={styles.back}>Retour à l’accueil<ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "CollectionPage",
        name: "Toutes nos catégories - Yodi-K", description: "Catégories de cosmétiques naturels et parapharmacie", url: `${SITE_URL}/categories`,
      }) }} />
    </main>
  );
}
