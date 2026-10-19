import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { UniversAffiche } from "@/lib/catalog";
import styles from "./HomeUnivers.module.css";

export default function HomeUnivers({ univers }: { univers: UniversAffiche[] }) {
  if (univers.length === 0) return null;

  return (
    <section id="univers" aria-labelledby="univers-titre" className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true" />À chacun son rituel</p>
            <h2 id="univers-titre">Nos <em>univers</em></h2>
            <p className={styles.intro}>Une envie, un geste, un moment pour vous. Trouvez votre prochain soin.</p>
          </div>
          <Link href="/categories" className={styles.allLink}>Explorer la boutique<ArrowRight size={16} aria-hidden="true" /></Link>
        </header>

        <ul className={styles.grid}>
          {univers.map((universe, index) => (
            <li key={universe.slug} className={styles.item}>
              <Link href={`/${universe.slug}`} className={styles.card}>
                <div className={styles.visual}>
                  <Image
                    src={universe.imageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1264px) 32vw, 384px"
                    className={styles.photo}
                  />
                  <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className={styles.content}>
                  <div><h3>{universe.title}</h3><span className={styles.invitation}>Découvrir la collection</span></div>
                  <span className={styles.arrow} aria-hidden="true"><ArrowRight size={20} strokeWidth={1.4} /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className={styles.closing}><span aria-hidden="true" />Le soin commence par une envie. À vous de choisir la vôtre.</p>
      </div>
    </section>
  );
}
