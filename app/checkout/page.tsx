"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import useStore from "@/lib/store-manage";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, LoaderCircle, ShoppingBag, Truck, UserRound } from "lucide-react";
import { deleliveryZones } from "@/lib/sampledata";
import { cartTotals, discountedPrice, formatMoney, productHref } from "@/lib/pricing";
import { formatProductName } from "@/lib/format";
import { trackInitiateCheckout, trackPurchase, sendToCAPI } from "@/components/MetaPixel";
import styles from "./page.module.css";

const subscribeHydration = (onChange: () => void) => useStore.persist.onFinishHydration(onChange);
const hydrationSnapshot = () => useStore.persist.hasHydrated();
const serverSnapshot = () => false;

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const carts = useStore((state) => state.carts);
  const hydrated = useSyncExternalStore(subscribeHydration, hydrationSnapshot, serverSnapshot);
  return <main className={styles.page}><div className={styles.container}>
    <nav className={styles.breadcrumb} aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><ChevronRight size={12} aria-hidden="true" /><Link href="/panier">Panier</Link><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">Commande</span></nav>
    <header className={styles.header}>
      <p className={styles.eyebrow}>Maison Yodi-K</p>
      <h1>Votre commande<span aria-hidden="true">.</span></h1>
      <p>Encore quelques détails pour recevoir vos soins.</p>
      <Link href="/panier" className={styles.back}><ArrowLeft size={16} aria-hidden="true" />Retour au panier</Link>
    </header>
    {!hydrated || status === "loading" ? <div className={styles.empty} role="status" aria-busy="true"><ShoppingBag size={28} aria-hidden="true" /><p>Préparation de votre commande…</p></div>
      : carts.length === 0 ? <section className={styles.empty} aria-labelledby="empty-title"><ShoppingBag size={30} strokeWidth={1.3} aria-hidden="true" /><h2 id="empty-title">Votre panier est encore vide.</h2><p>Choisissez vos soins avant de passer à la commande.</p><Link href="/" className={styles.primary}>Découvrir les soins<ArrowRight size={17} aria-hidden="true" /></Link></section>
      : <CheckoutForm key={session?.user?.id || "guest"} user={session?.user} />}
  </div></main>;
}

function CheckoutForm({ user }: { user?: Session["user"] }) {
  const { carts, selectedCurrency, usdRate } = useStore();
  // Wait for session resolution before mounting, so saved details prefill once.
  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [country, setCountry] = useState(user?.country || "");
  const [city, setCity] = useState(user?.city || "");
  const [zip, setZip] = useState(user?.zip || "");
  const [delivery, setDelivery] = useState("");
  const [address, setAddress] = useState(user?.address || "");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const requestPending = useRef(false);
  const initiated = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const totals = cartTotals(carts);
  const shippingCost = 1500; // Existing fixed fee, also enforced by /api/checkout.
  const totalXof = totals.subtotal + shippingCost;
  const total = selectedCurrency === "XOF" ? totalXof : Number((totalXof / Number(usdRate || 1)).toFixed(2));
  const money = (amount: number) => formatMoney(amount, selectedCurrency, usdRate);
  const deliveryZones = country === "senegal" ? deleliveryZones.senegal : country === "canada" ? deleliveryZones.canada : [];

  useEffect(() => {
    if (initiated.current || !carts.length) return;
    initiated.current = true;
    const payload = { value: totals.subtotal, currency: selectedCurrency, num_items: totals.quantity, content_ids: carts.map((cart) => cart.id) };
    const eventId = trackInitiateCheckout(payload);
    sendToCAPI("InitiateCheckout", { ...payload, content_type: "product" }, eventId);
  }, [carts, totals.subtotal, totals.quantity, selectedCurrency]);

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestPending.current || confirmed) return;
    if (!user || !carts.length || !deliveryZones.includes(delivery)) {
      setError(!user ? "Connectez-vous pour confirmer votre commande." : !carts.length ? "Votre panier est vide." : "Choisissez une zone de livraison pour le pays sélectionné.");
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    requestPending.current = true;
    setIsLoading(true);
    setError("");
    const orderData = {
      products: carts, shippingCost, valueCurrency: selectedCurrency === "XOF" ? 1 : Number(usdRate),
      selectedCurrency: selectedCurrency === "XOF" ? "FCFA" : "USD", total,
      paymentMethod: "on-delivery", status: "pending",
      shippingInfo: { firstname: firstname.trim(), lastname: lastname.trim(), email: email.trim(), phone: phone.trim(), country, city: city.trim(), postalCode: zip.trim(), zip: zip.trim(), delivery, address: address.trim(), message: message.trim() },
    };
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderData }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "La commande n’a pas pu être confirmée. Veuillez réessayer.");
      setConfirmed(true);
      const payload = { value: total, currency: selectedCurrency, content_ids: carts.map((cart) => cart.id), num_items: totals.quantity, order_id: data.orderId || "" };
      const eventId = trackPurchase(payload);
      sendToCAPI("Purchase", { ...payload, content_type: "product" }, eventId);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Erreur lors de la confirmation de la commande.");
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      requestPending.current = false;
      setIsLoading(false);
    }
  }

  if (confirmed) return <div ref={successRef} className={styles.empty} role="status" tabIndex={-1}><CheckCircle2 size={34} strokeWidth={1.3} aria-hidden="true" /><p className={styles.eyebrow}>Merci pour votre confiance</p><h2>Votre commande est confirmée.</h2><p>Nous vous contacterons dans les prochaines heures.</p><Link className={styles.primary} href="/">Revenir à la boutique<ArrowRight size={17} aria-hidden="true" /></Link></div>;

  return <form className={styles.layout} onSubmit={handleCheckout} aria-label="Informations de commande" aria-busy={isLoading}>
    <div className={styles.formColumn}>
      {!user && <div className={styles.account}><UserRound size={21} strokeWidth={1.4} aria-hidden="true" /><div><p>Un compte est nécessaire pour confirmer votre commande.</p><Link href="/connexion">Se connecter<ArrowRight size={14} aria-hidden="true" /></Link></div></div>}
      <p className={styles.requiredNote}>Les champs marqués d’un astérisque (*) sont obligatoires.</p>
      <fieldset className={styles.section} disabled={isLoading}>
        <legend><span className={styles.number}>01</span>Vos coordonnées</legend>
        <p className={styles.sectionNote}>Pour vous contacter au sujet de votre commande.</p>
        <div className={styles.fields}>
          <div className={styles.field}><label htmlFor="firstname">Prénom *</label><input id="firstname" name="firstname" autoComplete="given-name" value={firstname} onChange={(event) => setFirstname(event.target.value)} required pattern=".*\S.*" /></div>
          <div className={styles.field}><label htmlFor="lastname">Nom *</label><input id="lastname" name="lastname" autoComplete="family-name" value={lastname} onChange={(event) => setLastname(event.target.value)} required pattern=".*\S.*" /></div>
          <div className={styles.field}><label htmlFor="email">Adresse email *</label><input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
          <div className={styles.field}><label htmlFor="phone">Téléphone *</label><input id="phone" name="phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required pattern=".*\S.*" /></div>
        </div>
      </fieldset>
      <fieldset className={styles.section} disabled={isLoading}>
        <legend><span className={styles.number}>02</span>Votre livraison</legend>
        <p className={styles.sectionNote}>Indiquez l’adresse à laquelle recevoir vos soins.</p>
        <div className={styles.fields}>
          <div className={styles.field}><label htmlFor="country">Pays *</label><select id="country" name="country" autoComplete="country-name" value={country} onChange={(event) => { setCountry(event.target.value); setDelivery(""); }} required><option value="">Choisissez votre pays</option><option value="senegal">Sénégal</option><option value="canada">Canada</option></select></div>
          <div className={styles.field}><label htmlFor="city">Ville *</label><input id="city" name="city" autoComplete="address-level2" value={city} onChange={(event) => setCity(event.target.value)} required pattern=".*\S.*" /></div>
          <div className={styles.field}><label htmlFor="delivery">Zone de livraison *</label><select id="delivery" name="delivery" value={delivery} onChange={(event) => setDelivery(event.target.value)} required disabled={!deliveryZones.length} aria-describedby="zone-help"><option value="">Choisissez votre zone</option>{deliveryZones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}</select><p id="zone-help" className={styles.help}>Les zones dépendent du pays choisi.</p></div>
          <div className={styles.field}><label htmlFor="zip">Code postal *</label><input id="zip" name="zip" autoComplete="postal-code" value={zip} onChange={(event) => setZip(event.target.value)} required pattern=".*\S.*" /></div>
          <div className={`${styles.field} ${styles.wide}`}><label htmlFor="address">Adresse et point de repère *</label><input id="address" name="address" autoComplete="street-address" maxLength={60} value={address} onChange={(event) => setAddress(event.target.value)} required pattern=".*\S.*" aria-describedby="address-help" /><p className={styles.help} id="address-help">60 caractères maximum.</p></div>
          <div className={`${styles.field} ${styles.wide}`}><label htmlFor="message">Notes de commande <span>(facultatif)</span></label><textarea id="message" name="message" rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Une précision pour la livraison ?" /></div>
        </div>
      </fieldset>
      <fieldset className={styles.section} disabled={isLoading}>
        <legend><span className={styles.number}>03</span>Votre paiement</legend>
        <div className={styles.payment}><Check size={18} aria-hidden="true" /><div><strong>Paiement à la livraison</strong><p>Réglez en espèces à la réception de votre commande.</p></div><Truck size={22} strokeWidth={1.4} aria-hidden="true" /></div>
        <p className={styles.unavailable}>Seul le paiement à la livraison est disponible actuellement.</p>
        <ul className={styles.methods} aria-label="Autres moyens de paiement indisponibles"><li><Image src="/wave.png" alt="" width={22} height={22} />Wave<span>Indisponible</span></li><li><Image src="/orange-money.png" alt="" width={22} height={22} />Orange Money<span>Indisponible</span></li></ul>
      </fieldset>
    </div>
    <aside className={styles.summary} aria-labelledby="summary-title">
      <p className={styles.eyebrow}>Votre sélection</p><div className={styles.summaryHeading}><h2 id="summary-title">Vos soins, bientôt chez vous.</h2><Link href="/panier">Modifier le panier</Link></div>
      <ul className={styles.products}>{carts.map((cart) => <li key={cart.id}>
        <div className={styles.photo}>{cart.imageUrl ? <Image src={cart.imageUrl} alt="" fill sizes="56px" /> : <ShoppingBag size={20} aria-hidden="true" />}</div>
        <div className={styles.productDetails}><Link href={productHref({ ...cart, _id: cart.id })}>{formatProductName(cart.title)}</Link><span>Quantité : {cart.quantity}</span></div>
        <strong>{money(discountedPrice(cart.price, cart.discount) * cart.quantity)}</strong>
      </li>)}</ul>
      <dl className={styles.breakdown}>
        <div><dt>Sous-total ({totals.quantity} article{totals.quantity > 1 ? "s" : ""})</dt><dd>{money(totals.subtotal)}</dd></div>
        {totals.savings > 0 && <div className={styles.savings}><dt>Dont remises produits</dt><dd>{money(totals.savings)}</dd></div>}
        <div><dt>Livraison</dt><dd>{money(shippingCost)}</dd></div>
        <div className={styles.total}><dt>Total<span>Livraison comprise</span></dt><dd aria-live="polite">{money(totalXof)}</dd></div>
      </dl>
      {error && <div className={styles.error} role="alert" tabIndex={-1} ref={errorRef}><p>{error}</p><Link href="/panier">Vérifier mon panier</Link></div>}
      <button type="submit" className={styles.primary} disabled={isLoading || !user}>{isLoading ? <><LoaderCircle className={styles.spinner} size={18} aria-hidden="true" />Confirmation en cours…</> : <>Confirmer la commande<ArrowRight size={17} aria-hidden="true" /></>}</button>
      <p className={styles.note}>{user ? "Vous réglerez votre commande en espèces à la réception." : <>Connectez-vous pour confirmer votre commande.<br /><Link href="/connexion">Se connecter</Link></>}</p>
    </aside>
  </form>;
}
