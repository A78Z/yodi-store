"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import useStore from "@/lib/store-manage";
import { cartTotals, discountedPrice, formatMoney, productHref } from "@/lib/pricing";
import { formatProductName } from "@/lib/format";
import styles from "./page.module.css";

function subscribeHydration(onChange: () => void) {
  const unsubscribe = useStore.persist.onFinishHydration(onChange);
  return unsubscribe;
}
const hydrationSnapshot = () => useStore.persist.hasHydrated();
const serverSnapshot = () => false;

export default function CartPage() {
  const { carts, updateToCart, removeFromCart, selectedCurrency, usdRate } = useStore();
  const hydrated = useSyncExternalStore(subscribeHydration, hydrationSnapshot, serverSnapshot);
  const [message, setMessage] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const totals = cartTotals(carts);
  const money = (amount: number) => formatMoney(amount, selectedCurrency, usdRate);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
          <Link href="/">Accueil</Link><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">Panier</span>
        </nav>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Maison Yodi-K</p>
            <h1 ref={heading} tabIndex={-1}>Votre panier<span aria-hidden="true">.</span></h1>
            {hydrated && carts.length > 0 && <p className={styles.intro}>{totals.quantity} article{totals.quantity > 1 ? "s" : ""} pour vos rituels de soin.</p>}
          </div>
          {hydrated && carts.length > 0 && <Link href="/" className={styles.continue}><ArrowLeft size={16} aria-hidden="true" />Continuer les achats</Link>}
        </header>
        <p className={styles.srOnly} role="status">{message}</p>

        {!hydrated ? (
          <div className={styles.empty} role="status" aria-busy="true"><ShoppingBag size={30} aria-hidden="true" /><p>Chargement de votre panier…</p></div>
        ) : carts.length === 0 ? (
          <section className={styles.empty} aria-labelledby="empty-title">
            <span className={styles.bag}><ShoppingBag size={28} strokeWidth={1.3} aria-hidden="true" /></span>
            <p className={styles.eyebrow}>Un rituel commence ici</p>
            <h2 id="empty-title">Votre panier vous attend.</h2>
            <p>Découvrez nos soins et trouvez ceux qui vous accompagnent au quotidien.</p>
            <Link className={styles.primary} href="/">Découvrir les soins<ArrowRight size={17} aria-hidden="true" /></Link>
          </section>
        ) : (
          <div className={styles.layout}>
            <section aria-labelledby="items-title" className={styles.items}>
              <div className={styles.sectionHeading}><h2 id="items-title">Votre sélection</h2><span>{carts.length} référence{carts.length > 1 ? "s" : ""}</span></div>
              <ul className={styles.list}>
                {carts.map((cart) => {
                  const name = formatProductName(cart.title);
                  const unitPrice = discountedPrice(cart.price, cart.discount);
                  const href = productHref({ ...cart, _id: cart.id });
                  const atStockLimit = Number.isFinite(cart.stock) && cart.quantity >= cart.stock;
                  return (
                    <li key={cart.id} className={styles.item}>
                      <Link href={href} className={styles.photo} tabIndex={-1} aria-hidden="true">
                        {cart.imageUrl ? <Image src={cart.imageUrl} alt="" fill sizes="(max-width: 600px) 88px, 128px" className={styles.image} /> : <ShoppingBag size={24} />}
                      </Link>
                      <div className={styles.details}>
                        <h3><Link href={href}>{name}</Link></h3>
                        <p className={styles.unitPrice}>{money(unitPrice)} <span>/ unité</span></p>
                        {(cart.discount ?? 0) > 0 && <p className={styles.discount}><s>{money(cart.price)}</s><span>−{cart.discount} %</span></p>}
                      </div>
                      <button className={styles.remove} aria-label={`Retirer ${name} du panier`} onClick={(event) => {
                        const keyboard = event.detail === 0;
                        removeFromCart(cart.id);
                        setMessage(`${name} retiré du panier.`);
                        if (keyboard) requestAnimationFrame(() => heading.current?.focus());
                      }}><Trash2 size={17} aria-hidden="true" /></button>
                      <div className={styles.controls}>
                        <div className={styles.quantity} role="group" aria-label={`Quantité de ${name}`}>
                          <button disabled={cart.quantity <= 1} aria-label={`Diminuer la quantité de ${name}`} onClick={() => updateToCart(cart.id, cart.quantity - 1)}><Minus size={15} aria-hidden="true" /></button>
                          <output aria-label={`Quantité de ${name}`} aria-live="polite">{cart.quantity}</output>
                          <button disabled={atStockLimit} aria-label={`Augmenter la quantité de ${name}`} onClick={() => updateToCart(cart.id, cart.quantity + 1)}><Plus size={15} aria-hidden="true" /></button>
                        </div>
                        {atStockLimit && <span className={styles.limit}>Quantité disponible atteinte</span>}
                      </div>
                      <p className={styles.lineTotal}><span>Total de l’article</span><strong>{money(unitPrice * cart.quantity)}</strong></p>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.delivery}><Truck size={21} strokeWidth={1.4} aria-hidden="true" /><p><strong>La suite de votre rituel</strong><br />Renseignez votre adresse à l’étape suivante pour finaliser la livraison.</p></div>
            </section>
            <aside className={styles.summary} aria-labelledby="summary-title">
              <p className={styles.eyebrow}>Votre commande</p>
              <h2 id="summary-title">L’essentiel, pour vous.</h2>
              <dl className={styles.breakdown}>
                <div><dt>Articles ({totals.quantity})</dt><dd>{money(totals.subtotal + totals.savings)}</dd></div>
                {totals.savings > 0 && <div className={styles.savings}><dt>Remises produits</dt><dd>−{money(totals.savings)}</dd></div>}
                <div className={styles.shipping}><dt>Livraison</dt><dd>À l’étape suivante</dd></div>
                <div className={styles.subtotal}><dt>Sous-total<span>Hors livraison</span></dt><dd aria-live="polite">{money(totals.subtotal)}</dd></div>
              </dl>
              <Link href="/checkout" className={styles.primary}>Passer à la commande<ArrowRight size={17} aria-hidden="true" /></Link>
              <p className={styles.note}>Les frais de livraison seront ajoutés avant la validation de votre commande.</p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
