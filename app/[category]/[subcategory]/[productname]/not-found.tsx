import Link from "next/link";
import styles from "@/components/ProductDetail.module.css";

export default function ProductNotFound() {
  return <main className={styles.page}><div className={styles.container}><div className={styles.state}>
    <p className={styles.eyebrow}>Maison Yodi-K</p>
    <h1>Ce soin est introuvable</h1>
    <p>Ce produit n’est plus accessible à cette adresse. Retrouvez nos soins dans la boutique.</p>
    <Link className={styles.back} href="/categories">Découvrir les univers Yodi-K</Link>
  </div></div></main>;
}
