import styles from "@/components/ProductCategory.module.css";

export default function CategoryLoading() {
  return <main className={styles.page} aria-busy="true" aria-label="Chargement du catalogue">
    <div className={styles.container}>
      <p role="status" className={styles.loadingText}>Chargement de votre univers…</p>
      <div className={styles.grid} aria-hidden="true">{Array.from({ length: 3 }, (_, index) => <div key={index} className={styles.skeleton} />)}</div>
    </div>
  </main>;
}
