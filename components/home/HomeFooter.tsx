import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok, FaSnapchat, FaWhatsapp } from "react-icons/fa";
import { Mail, MessageCircle, Phone } from "lucide-react";
import type { UniversAffiche } from "@/lib/catalog";
import { CONTACT_EMAIL, PHONE_CA, PHONE_COMMERCIAL, PHONE_SN, WHATSAPP } from "@/lib/site";
import Flag from "@/components/home/Flag";

const SOCIALS = [
  { href: "https://www.facebook.com/yyodistores", label: "Facebook", Icon: FaFacebook },
  { href: "https://www.instagram.com/yodi_store", label: "Instagram", Icon: FaInstagram },
  { href: "https://tiktok.com/@yyodi2", label: "TikTok", Icon: FaTiktok },
  { href: "https://www.snapchat.com/add/yyodi-store", label: "Snapchat", Icon: FaSnapchat },
];

const linkClass = "text-sable/90 transition-colors hover:text-ivoire focus-visible:outline-none focus-visible:underline";

// Pied de page de l'Accueil (refonte A). Uniquement des informations réelles :
// numéros et email de lib/site.ts, univers visibles, moyens de paiement du brief.
const HomeFooter = ({ univers }: { univers: UniversAffiche[] }) => (
  <footer className="mt-14 md:mt-24">
    {/* Bloc conseil WhatsApp */}
    <div className="px-4 md:px-8">
      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-3xl bg-sauge p-5 text-ivoire transition-colors hover:bg-[#53624A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sauge focus-visible:ring-offset-2 md:p-8"
      >
        <span>
          <span className="block font-fraunces text-xl md:text-3xl">Une question ? Écrivez-nous</span>
          <span className="mt-1 block font-dmsans text-sm text-ivoire/90 md:text-base">
            Conseil et commande sur WhatsApp
          </span>
        </span>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ivoire text-sauge" aria-hidden="true">
          <FaWhatsapp className="h-6 w-6" />
        </span>
      </a>
    </div>

    <div className="mt-10 bg-cacao px-4 pb-28 pt-10 font-dmsans text-sm text-sable md:mt-16 md:px-8 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <Image src="/logo-yodi-k.png" alt="Yodi-K" width={140} height={116} className="h-auto w-[96px] rounded-lg bg-ivoire p-2" />
          <p className="mt-4 max-w-xs leading-relaxed text-sable/90">
            Cosmétiques naturels et parapharmacie en ligne. Présents au Sénégal et au Canada.
          </p>
          <ul className="mt-5 space-y-3" aria-label="Nous contacter">
            <li>
              <a href={`tel:${PHONE_COMMERCIAL.tel}`} className={`inline-flex items-center gap-2.5 ${linkClass}`}>
                <Flag country="SN" />
                <Phone className="h-4 w-4" aria-hidden="true" />
                {PHONE_COMMERCIAL.label}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2.5 ${linkClass}`}>
                <Flag country="SN" />
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {PHONE_SN.label} <span className="text-sable/70">(WhatsApp)</span>
              </a>
            </li>
            <li>
              <a href={`tel:${PHONE_CA.tel}`} className={`inline-flex items-center gap-2.5 ${linkClass}`}>
                <Flag country="CA" />
                <Phone className="h-4 w-4" aria-hidden="true" />
                {PHONE_CA.label}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={`inline-flex items-center gap-2.5 ${linkClass}`}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Univers">
          <h2 className="font-fraunces text-lg text-ivoire">Nos univers</h2>
          <ul className="mt-4 space-y-2.5">
            {univers.map((u) => (
              <li key={u.slug}>
                <Link href={`/${u.slug}`} className={linkClass}>{u.title}</Link>
              </li>
            ))}
            <li><Link href="/categories" className={linkClass}>Toutes les catégories</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="font-fraunces text-lg text-ivoire">Aide</h2>
          <ul className="mt-4 space-y-2.5">
            <li><Link href="/profile" className={linkClass}>Mon compte</Link></li>
            <li><Link href="/condition-dutilisations" className={linkClass}>Conditions générales de vente</Link></li>
          </ul>
          <ul className="mt-6 flex gap-3" aria-label="Réseaux sociaux">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Yodi-K sur ${label}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-sable/30 text-sable transition-colors hover:bg-ivoire hover:text-cacao"
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-sable/20 pt-6">
        <p className="text-xs uppercase tracking-[0.14em] text-sable/70">Moyens de paiement</p>
        <ul className="mt-3 flex flex-wrap items-center gap-2">
          <li><Image src="/wave.png" alt="Wave" width={120} height={48} className="h-8 w-auto rounded-md bg-ivoire px-2 py-1" /></li>
          <li><Image src="/orange-money.png" alt="Orange Money" width={120} height={48} className="h-8 w-auto rounded-md bg-ivoire px-2 py-1" /></li>
          <li className="rounded-md bg-ivoire px-3 py-1.5 text-xs font-medium text-cacao">Carte bancaire</li>
          <li className="rounded-md bg-ivoire px-3 py-1.5 text-xs font-medium text-cacao">Espèces</li>
        </ul>
        <p className="mt-8 text-xs text-sable/70">© {new Date().getFullYear()} Yodi-K — Tous droits réservés.</p>
      </div>
    </div>
  </footer>
);

export default HomeFooter;
