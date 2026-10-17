import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { IProduct } from "@/lib/models/product";
import { categoryLabel } from "@/lib/catalog";
import HomeProductTile from "@/components/home/HomeProductTile";
import styles from "./HomeProducts.module.css";

export default function HomeProducts({ products }: { products: IProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section id="produits" aria-labelledby="produits-titre" className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true" />Les soins de la maison</p>
            <h2 id="produits-titre">Nos <em>produits</em></h2>
            <p className={styles.intro}>Des soins à découvrir, des gestes à adopter. Composez votre rituel à votre rythme.</p>
          </div>
          <Link href="/categories" className={styles.allLink}>Tous nos univers<ArrowRight size={16} aria-hidden="true" /></Link>
        </header>
        <ul className={styles.grid}>
          {products.map(product => (
            <li key={String(product._id)}>
              <HomeProductTile product={product} categoryTitle={categoryLabel(product.category)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
