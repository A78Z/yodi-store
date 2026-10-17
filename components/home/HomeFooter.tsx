import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok, FaSnapchat, FaWhatsapp } from "react-icons/fa";
import { ArrowUpRight, CreditCard, Mail, MessageCircle, Phone } from "lucide-react";
import type { UniversAffiche } from "@/lib/catalog";
import { CONTACT_EMAIL, PHONE_CA, PHONE_COMMERCIAL, PHONE_SN, WHATSAPP } from "@/lib/site";
import FacebookGallery from "@/components/home/FacebookGallery";
import type { FacebookGalleryMedia } from "@/lib/facebook-gallery";
import Flag from "@/components/home/Flag";
import styles from "./HomeFooter.module.css";

const SOCIALS = [
  { href: "https://www.facebook.com/yyodistores", label: "Facebook", Icon: FaFacebook },
  { href: "https://www.instagram.com/yodi_store", label: "Instagram", Icon: FaInstagram },
  { href: "https://tiktok.com/@yyodi2", label: "TikTok", Icon: FaTiktok },
  { href: "https://www.snapchat.com/add/yyodi-store", label: "Snapchat", Icon: FaSnapchat },
];

const HomeFooter = ({ univers, facebookMedia = [] }: { univers: UniversAffiche[]; facebookMedia?: FacebookGalleryMedia[] }) => (
  <footer id="pied-de-page" className={styles.footer} aria-label="Maison Yodi-K">
    <div className={styles.adviceWrap}>
      <div className={styles.advice}>
        <div>
          <p className={styles.eyebrow}><span aria-hidden="true" /> À votre écoute</p>
          <h2>Un conseil, <em>un rituel à trouver ?</em></h2>
          <p className={styles.adviceText}>Une question sur nos soins ou votre commande ? Échangeons sur WhatsApp.</p>
        </div>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>
          <FaWhatsapp aria-hidden="true" />
          Écrivez-nous
          <ArrowUpRight aria-hidden="true" />
          <span className="sr-only"> sur WhatsApp (nouvel onglet)</span>
        </a>
      </div>
    </div>

    <FacebookGallery media={facebookMedia} />

    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" aria-label="Retour à l’accueil Yodi-K" className={styles.logo}>
              <Image src="/logo-yodi-k.png" alt="Yodi-K" width={140} height={116} />
            </Link>
            <p className={styles.brandTitle}>Le soin, <em>tout simplement.</em></p>
            <p className={styles.description}>Cosmétiques naturels et parapharmacie en ligne. Présents au Sénégal et au Canada.</p>
            <ul className={styles.socials} aria-label="Réseaux sociaux">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Yodi-K sur ${label} (nouvel onglet)`}>
                    <Icon aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Univers du pied de page" className={styles.navigation}>
            <h2>Nos univers</h2>
            <ul>
              {univers.map((u) => (
                <li key={u.slug}><Link href={`/${u.slug}`}>{u.title}<ArrowUpRight aria-hidden="true" /></Link></li>
              ))}
              <li><Link href="/categories">Tous les univers<ArrowUpRight aria-hidden="true" /></Link></li>
            </ul>
          </nav>

          <nav aria-label="Informations et compte" className={styles.navigation}>
            <h2>À vos côtés</h2>
            <ul>
              <li><Link href="/profile">Mon compte</Link></li>
              <li><Link href="/panier">Mon panier</Link></li>
              <li><Link href="/condition-dutilisations">Conditions générales de vente</Link></li>
            </ul>
          </nav>

          <div className={styles.contact}>
            <h2>Parlons de vous</h2>
            <ul aria-label="Nous contacter">
              <li>
                <p className={styles.country}><Flag country="SN" /> Sénégal</p>
                <a href={`tel:${PHONE_COMMERCIAL.tel}`}><Phone aria-hidden="true" />{PHONE_COMMERCIAL.label}<span className="sr-only"> (Sénégal)</span></a>
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />{PHONE_SN.label}<span className="sr-only"> sur WhatsApp (nouvel onglet)</span></a>
              </li>
              <li>
                <p className={styles.country}><Flag country="CA" /> Canada</p>
                <a href={`tel:${PHONE_CA.tel}`}><Phone aria-hidden="true" />{PHONE_CA.label}<span className="sr-only"> (Canada)</span></a>
              </li>
              <li><a href={`mailto:${CONTACT_EMAIL}`}><Mail aria-hidden="true" />{CONTACT_EMAIL}</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.payments}>
            <p>Moyens de paiement</p>
            <ul aria-label="Moyens de paiement">
              <li><Image src="/wave.png" alt="Wave" width={120} height={48} /></li>
              <li><Image src="/orange-money.png" alt="Orange Money" width={120} height={48} /></li>
              <li><CreditCard aria-hidden="true" /><span>Carte bancaire</span></li>
              <li><span>Espèces</span></li>
            </ul>
          </div>
          <p className={styles.copyright}>© {new Date().getFullYear()} Yodi-K<br />Tous droits réservés.</p>
        </div>
      </div>
    </div>
  </footer>
);

export default HomeFooter;
