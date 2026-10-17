"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ChevronDown, MapPin, MessageCircle, Minus, Package, Phone, Plus, User, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { DialogClose, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import useStore from "@/lib/store-manage";
import { cartTotals, discountedPrice, formatMoney, productHref } from "@/lib/pricing";
import { formatProductName } from "@/lib/format";
import { remainingProductQuantity } from "@/lib/product-quantity";
import { PHONE_COMMERCIAL, SITE_URL } from "@/lib/site";
import { normalizeOrderPhone, validateWhatsAppOrder, validateWhatsAppCartOrder, whatsappOrderHref, whatsappCartOrderHref, type PhoneCountry, type WhatsAppOrderErrors, type WhatsAppOrderFields } from "@/lib/whatsapp-order";
import type { WhatsAppOrderButtonProps } from "./WhatsAppOrderButton";
import styles from "./WhatsAppOrderForm.module.css";

export default function WhatsAppOrderForm(props: WhatsAppOrderButtonProps) {
  const cartMode = "cartItems" in props;
  const cartItems = cartMode ? props.cartItems : null;
  const product = cartMode ? null : props.product;
  const id = useId();
  const currency = useStore(state => state.selectedCurrency);
  const usdRate = useStore(state => state.usdRate);
  const inCart = useStore(state => state.carts.filter(item => item.id === String(product?._id)).reduce((sum, item) => sum + item.quantity, 0));
  const maxQuantity = !product || product.disponible === false ? 0 : remainingProductQuantity(product.stock, inCart);
  const [fields, setFields] = useState<WhatsAppOrderFields>({
    phoneCountry: "SN", phone: "", street: "", city: "", deliveryCountry: "Sénégal", customerName: "", note: "",
    quantity: Math.max(1, Math.min(Math.floor(cartMode ? 1 : props.initialQuantity ?? 1) || 1, Math.max(1, maxQuantity))),
  });
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<WhatsAppOrderErrors>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>(() => Object.fromEntries((cartItems ?? []).map(item => [item.id, item.quantity])));
  const [optionalOpen, setOptionalOpen] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lines = cartItems ? cartItems.map(item => ({
    id: item.id, product: { ...item, _id: item.id }, name: formatProductName(item.title),
    displayedPrice: formatMoney(discountedPrice(item.price, item.discount), currency, usdRate),
    quantity: cartQuantities[item.id] ?? item.quantity,
    // These units already belong to this cart; do not subtract the cart a second time.
    maxQuantity: item.disponible === false ? 0 : remainingProductQuantity(item.stock, 0),
  })) : product && !cartMode ? [{ id: String(product._id), product, name: props.name, displayedPrice: props.displayedPrice, quantity: fields.quantity, maxQuantity }] : [];
  const subtotal = formatMoney(cartTotals(lines.map(line => ({ ...line.product, quantity: line.quantity }))).subtotal, currency, usdRate);
  const unavailable = lines.length === 0 || lines.some(line => line.maxQuantity < 1);
  const messageLines = lines.map(line => ({ name: line.name, displayedPrice: line.displayedPrice,
    displayedLineTotal: formatMoney(discountedPrice(line.product.price, line.product.discount) * line.quantity, currency, usdRate),
    quantity: line.quantity, maxQuantity: line.maxQuantity,
    publicProductUrl: new URL(productHref(line.product), SITE_URL).href,
  }));

  useEffect(() => {
    bodyRef.current?.scrollTo(0, 0);
    if (step === 1) phoneRef.current?.focus({ preventScroll: true });
    else headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  function update<Key extends keyof WhatsAppOrderFields>(key: Key, value: WhatsAppOrderFields[Key]) {
    setFields(previous => ({ ...previous, [key]: value }));
  }
  function validate() {
    const nextErrors = cartMode ? validateWhatsAppCartOrder(fields, messageLines) : validateWhatsAppOrder(fields, maxQuantity);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      if (step !== 1) setStep(1);
      // Wait for the inline errors to mount before moving focus to the first field.
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return false;
    }
    return true;
  }
  function continueOrder(event: FormEvent) {
    event.preventDefault();
    if (validate()) setStep(2);
  }
  function openWhatsApp() {
    if (!validate()) return;
    const href = cartMode ? whatsappCartOrderHref({ lines: messageLines, displayedSubtotal: subtotal, phone: PHONE_COMMERCIAL.tel, fields })
      : whatsappOrderHref({ name: messageLines[0].name, displayedPrice: messageLines[0].displayedPrice, displayedSubtotal: subtotal,
        publicProductUrl: messageLines[0].publicProductUrl, phone: PHONE_COMMERCIAL.tel, fields, maxQuantity });
    window.open(href, "_blank", "noopener,noreferrer");
  }
  const error = (field: keyof WhatsAppOrderErrors) => errors[field] ? <p id={`${id}-${field}-error`} className={styles.error} role="alert">{errors[field]}</p> : null;
  const invalid = (field: keyof WhatsAppOrderErrors) => ({ "aria-invalid": errors[field] ? true : undefined, "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined });

  return <form ref={formRef} className={styles.form} onSubmit={continueOrder} noValidate>
    <header className={styles.header}>
      <p className={styles.eyebrow}>Yodi-K · Étape {step}/2</p>
      <DialogTitle ref={headingRef} tabIndex={-1} className={styles.title}>{step === 1 ? "Vos coordonnées" : "Votre récapitulatif"}</DialogTitle>
      <DialogDescription className={styles.description}>{step === 1 ? "Prépare ta demande, notre équipe te répondra sur WhatsApp." : "Vérifie les informations avant d’ouvrir WhatsApp."}</DialogDescription>
      <DialogClose asChild><button type="button" className={styles.close} aria-label="Fermer la demande WhatsApp"><X size={24} aria-hidden="true" /></button></DialogClose>
    </header>

    <div className={styles.body} ref={bodyRef}>
      {cartMode && <p className={styles.selectionLabel}>{lines.length} référence{lines.length > 1 ? "s" : ""} · {lines.reduce((sum, line) => sum + line.quantity, 0)} article{lines.reduce((sum, line) => sum + line.quantity, 0) > 1 ? "s" : ""}</p>}
      <div className={styles.productList}>
        {lines.map(line => {
          const photo = line.product.imageUrl && line.product.imageUrl !== "/logo-yodi-k.png" ? line.product.imageUrl : "";
          const changeQuantity = (quantity: number) => cartMode ? setCartQuantities(previous => ({ ...previous, [line.id]: quantity })) : update("quantity", quantity);
          const quantityLabel = cartMode ? ` de ${line.name}` : " de la demande";
          return <div key={line.id}>
            <div className={styles.product}>
              <div className={styles.photo}>{photo && !failedImages[line.id] ? <Image src={photo} alt={line.name} fill sizes="72px" onError={() => setFailedImages(previous => ({ ...previous, [line.id]: true }))} /> : <Package size={26} aria-label="Photo indisponible" />}</div>
              <div className={styles.productText}><h3>{line.name}</h3><p>{line.displayedPrice} × {line.quantity}</p>
                {cartMode && <p className={styles.linePrice}>Total : {formatMoney(discountedPrice(line.product.price, line.product.discount) * line.quantity, currency, usdRate)}</p>}
              </div>
              {step === 1 ? <div className={styles.quantity} role="group" aria-label={cartMode ? `Quantité de ${line.name}` : "Quantité du produit"} tabIndex={-1} {...invalid("quantity")}>
                <button type="button" aria-label={`Diminuer la quantité${quantityLabel}`} disabled={line.quantity <= 1} onClick={() => changeQuantity(line.quantity - 1)}><Minus size={17} aria-hidden="true" /></button>
                <output aria-live="polite" aria-label={`Quantité${quantityLabel}`}>{line.quantity}</output>
                <button type="button" aria-label={`Augmenter la quantité${quantityLabel}`} disabled={line.quantity >= line.maxQuantity} onClick={() => changeQuantity(line.quantity + 1)}><Plus size={17} aria-hidden="true" /></button>
              </div> : <p className={styles.summaryQuantity}>Quantité : {line.quantity}</p>}
            </div>
            {line.maxQuantity < 1 && <p className={styles.error} role="alert">{line.name} n’est pas disponible à la commande pour le moment.</p>}
          </div>;
        })}
      </div>
      {lines.length === 0 && <p className={styles.error} role="alert">Le panier est vide.</p>}
      {cartMode && step === 1 && <p className={styles.help}>Les ajustements de quantité restent propres à cette demande WhatsApp.</p>}
      {error("quantity")}

      {step === 1 ? <>
        <div className={styles.field}>
          <label htmlFor={`${id}-phone`}><Phone size={19} aria-hidden="true" />Ton numéro <span>*</span></label>
          <div className={styles.phoneRow}>
            <select aria-label="Indicatif du téléphone" value={fields.phoneCountry} onChange={event => update("phoneCountry", event.target.value as PhoneCountry)}>
              <option value="SN">🇸🇳 +221</option><option value="CA">🇨🇦 +1</option>
            </select>
            <input ref={phoneRef} id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="off" required maxLength={25}
              placeholder={fields.phoneCountry === "SN" ? "77 000 00 00" : "819 555 0123"} value={fields.phone} onChange={event => update("phone", event.target.value)}
              {...invalid("phone")} aria-describedby={`${id}-phone-help${errors.phone ? ` ${id}-phone-error` : ""}`} />
          </div>
          <p id={`${id}-phone-help`} className={styles.help}>Ce numéro permettra de te contacter pour la livraison.</p>{error("phone")}
        </div>
        <fieldset className={styles.address}>
          <legend><MapPin size={19} aria-hidden="true" />Adresse de livraison <span>*</span></legend>
          <p className={styles.help}>Saisie manuelle · indique ton quartier ou ta rue, ta ville et ton pays.</p>
          <div className={styles.field}>
            <label htmlFor={`${id}-street`}>Quartier ou rue *</label>
            <input id={`${id}-street`} name="street" required autoComplete="off" maxLength={240} placeholder="Ton quartier, ta rue, un repère…" value={fields.street} onChange={event => update("street", event.target.value)} {...invalid("street")} />{error("street")}
          </div>
          <div className={styles.addressRow}>
            <div className={styles.field}><label htmlFor={`${id}-city`}>Ville *</label><input id={`${id}-city`} name="city" required autoComplete="off" maxLength={100} placeholder="Ta ville" value={fields.city} onChange={event => update("city", event.target.value)} {...invalid("city")} />{error("city")}</div>
            <div className={styles.field}><label htmlFor={`${id}-country`}>Pays *</label><input id={`${id}-country`} name="country" required autoComplete="off" maxLength={80} value={fields.deliveryCountry} onChange={event => update("deliveryCountry", event.target.value)} {...invalid("deliveryCountry")} />{error("deliveryCountry")}</div>
          </div>
        </fieldset>
        <div className={styles.optional}>
          <button type="button" className={styles.optionalToggle} aria-expanded={optionalOpen} aria-controls={`${id}-optional`} onClick={() => setOptionalOpen(value => !value)}>Ajouter mon nom ou un mot pour le vendeur <ChevronDown size={18} aria-hidden="true" /></button>
          {optionalOpen && <div id={`${id}-optional`} className={styles.optionalFields}>
            <div className={styles.field}><label htmlFor={`${id}-name`}><User size={18} aria-hidden="true" />Ton nom <small>facultatif</small></label><input id={`${id}-name`} name="customerName" autoComplete="off" maxLength={120} placeholder="Pour que notre équipe te reconnaisse" value={fields.customerName} onChange={event => update("customerName", event.target.value)} /></div>
            <div className={styles.field}><label htmlFor={`${id}-note`}><MessageCircle size={18} aria-hidden="true" />Un mot pour le vendeur <small>facultatif</small></label><textarea id={`${id}-note`} name="note" autoComplete="off" rows={3} maxLength={600} placeholder="Un repère, une préférence de livraison…" value={fields.note} onChange={event => update("note", event.target.value)} /></div>
          </div>}
        </div>
      </> : <>
        <dl className={styles.recap}>
          {!cartMode && <div><dt>Prix unitaire</dt><dd>{lines[0]?.displayedPrice}</dd></div>}
          <div><dt>Sous-total produits</dt><dd>{subtotal}</dd></div>
          <div><dt>Téléphone</dt><dd>{normalizeOrderPhone(fields.phone, fields.phoneCountry)}</dd></div>
          <div><dt>Adresse de livraison</dt><dd>{fields.street.trim()}<br />{fields.city.trim()}, {fields.deliveryCountry.trim()}</dd></div>
          {fields.customerName.trim() && <div><dt>Ton nom</dt><dd>{fields.customerName.trim()}</dd></div>}
          {fields.note.trim() && <div><dt>Un mot pour le vendeur</dt><dd>{fields.note.trim()}</dd></div>}
        </dl>
        <p className={styles.notice}>Cette demande ne confirme ni achat ni paiement. Tu pourras vérifier le message et l’envoyer toi-même dans WhatsApp.</p>
      </>}
    </div>

    <footer className={styles.footer}>
      <div className={styles.total}><span>Sous-total produits</span><strong aria-live="polite">{subtotal}</strong></div>
      <p className={styles.fees}>Frais de livraison à confirmer</p>
      {step === 1 ? <button type="submit" className={styles.primary} disabled={unavailable}>Continuer</button> : <div className={styles.finalActions}>
        <button type="button" className={styles.modify} onClick={() => setStep(1)}>Modifier</button>
        <button type="button" className={styles.primary} disabled={unavailable} onClick={openWhatsApp}><FaWhatsapp size={20} aria-hidden="true" />Envoyer la demande sur WhatsApp</button>
      </div>}
    </footer>
  </form>;
}
