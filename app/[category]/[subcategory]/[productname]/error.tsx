"use client";

import Link from "next/link";
import styles from "@/components/ProductDetail.module.css";

export default function ProductError({ reset }: { reset: () => void }) {
  return <main className={styles.page}><div className={styles.container}><div role="alert" className={styles.state}>
    <h1>Le soin n’a pas pu être chargé</h1>
    <p>Réessayez dans un instant pour retrouver les informations du produit.</p>
    <button type="button" onClick={reset}>Réessayer</button>
    <Link className={styles.back} href="/categories">Revenir à la boutique</Link>
  </div></div></main>;
}
