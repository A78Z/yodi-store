import styles from "./ProductDetail.module.css";

export default function ProductDetailSkeleton() {
  return <main className={styles.page} aria-busy="true" aria-label="Chargement du produit">
    <div className={styles.container}>
      <p role="status" className={styles.breadcrumb}>Chargement du soin…</p>
      <div className={styles.hero} aria-hidden="true">
        <div className={styles.skeletonPhoto} />
        <div className={styles.identity}><div className={styles.skeletonLine} /><div className={styles.skeletonLine} /></div>
        <div className={styles.purchase}>{Array.from({ length: 5 }, (_, index) => <div key={index} className={styles.skeletonLine} />)}</div>
      </div>
    </div>
  </main>;
}
