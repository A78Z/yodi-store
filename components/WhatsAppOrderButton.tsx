import { FaWhatsapp } from "react-icons/fa";
import { whatsappOrderHref } from "@/lib/whatsapp-order";
import { productHref } from "@/lib/pricing";
import { PHONE_COMMERCIAL, SITE_URL } from "@/lib/site";
import styles from "./WhatsAppOrderButton.module.css";

export default function WhatsAppOrderButton({ product, name, displayedPrice }: {
  product: { _id: unknown; category: string; subCategory?: string };
  name: string;
  displayedPrice: string;
}) {
  const href = whatsappOrderHref(name, displayedPrice, new URL(productHref(product), SITE_URL).href, PHONE_COMMERCIAL.tel);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.button}
      aria-label={`Commander sur WhatsApp : ${name} (nouvel onglet)`}>
      <FaWhatsapp size={19} aria-hidden="true" />
      <span>Commander sur WhatsApp</span>
    </a>
  );
}
