"use client";

import Link from "next/link";
import styles from "@/components/ProductCategory.module.css";

export default function CategoryError({ reset }: { reset: () => void }) {
  return <main className={styles.page}>
    <div className={styles.container}>
      <div role="alert" className={styles.empty}>
        <h1 className="font-fraunces text-3xl">Le catalogue est momentanément indisponible</h1>
        <p>Nous n’avons pas pu charger les produits. Réessayez dans un instant.</p>
        <button type="button" onClick={reset}>Réessayer</button>
      </div>
      <Link className={styles.back} href="/">Revenir à l’accueil</Link>
    </div>
  </main>;
}
