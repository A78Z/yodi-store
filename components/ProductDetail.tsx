"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, ChevronRight, ImageOff, MessageCircle, Minus, Plus, ShoppingBag, Truck, X, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import type { IProduct } from "@/lib/models/product";
import useStore from "@/lib/store-manage";
import { formatProductName } from "@/lib/format";
import { discountedPrice, formatMoney } from "@/lib/pricing";
import { remainingProductQuantity } from "@/lib/product-quantity";
import { PHONE_COMMERCIAL, WHATSAPP } from "@/lib/site";
import { trackViewContent, trackAddToCart, sendToCAPI } from "@/components/MetaPixel";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import NotifyButton from "@/components/NotifyButton";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import styles from "./ProductDetail.module.css";

export default function ProductDetail({ initialProduct: product, categoryTitle, subcategoryTitle }: {
  initialProduct: IProduct; categoryTitle: string; subcategoryTitle?: string;
}) {
  const addToCart = useStore((state) => state.addToCart);
  const currency = useStore((state) => state.selectedCurrency);
  const usdRate = useStore((state) => state.usdRate);
  const id = String(product._id);
  const inCart = useStore((state) => state.carts.filter((item) => item.id === id).reduce((sum, item) => sum + item.quantity, 0));
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [addedQuantity, setAddedQuantity] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [waitingCount, setWaitingCount] = useState(0);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const name = formatProductName(product.title);
  const price = discountedPrice(product.price, product.discount);
  const upcoming = product.disponible === false;
  const remaining = remainingProductQuantity(product.stock, inCart);
  const quantity = Math.min(requestedQuantity, Math.max(1, remaining));
  const canAdd = !upcoming && remaining > 0;
  const photo = product.imageUrl === "/logo-yodi-k.png" ? "" : product.imageUrl || "";

  useEffect(() => {
    trackViewContent({ id, name: product.title, category: product.category, price, currency });
  }, [id, product.title, product.category, price, currency]);

  useEffect(() => () => { if (addedTimer.current) clearTimeout(addedTimer.current); }, []);

  useEffect(() => {
    if (!upcoming) return;
    const controller = new AbortController();
    fetch(`/api/notifications/subscribe?produitId=${id}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Notification count unavailable"); return response.json(); })
      .then((data) => { if (!controller.signal.aborted && Number.isSafeInteger(data.count) && data.count > 0) setWaitingCount(data.count); })
      .catch(() => {});
    return () => controller.abort();
  }, [id, upcoming]);

  const handleAdd = () => {
    // Relire le panier au clic pour tenir compte d'un ajout depuis un autre composant.
    const cartQuantity = useStore.getState().carts.filter((item) => item.id === id).reduce((sum, item) => sum + item.quantity, 0);
    if (upcoming || remainingProductQuantity(product.stock, cartQuantity) < quantity) {
      toast.error("Cette quantité n’est plus disponible.");
      return;
    }
    addToCart({ ...product, id, quantity });
    const eventId = trackAddToCart({ id, name: product.title, price, quantity, currency });
    sendToCAPI("AddToCart", {
      content_ids: [id], content_name: product.title, content_type: "product",
      value: price * quantity, currency, num_items: quantity,
    }, eventId);
    setAddedQuantity(quantity);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1800);
    toast.success("Produit ajouté au panier", { duration: 3000, position: "top-right" });
  };

  return <main className={styles.page}>
    <div className={styles.container}>
      <nav aria-label="Fil d’Ariane" className={styles.breadcrumb}>
        <ol>
          <li><Link href="/">Accueil</Link></li>
          <li><ChevronRight size={12} aria-hidden="true" /><Link href={`/${product.category}`}>{categoryTitle}</Link></li>
          {product.subCategory && <li><ChevronRight size={12} aria-hidden="true" /><Link href={`/${product.category}/${product.subCategory}`}>{subcategoryTitle}</Link></li>}
          <li><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">{name}</span></li>
        </ol>
      </nav>

      <div className={styles.hero}>
        <header className={styles.identity}>
          <Link href={`/${product.category}`} className={styles.eyebrow}>Maison Yodi-K · {categoryTitle}</Link>
          <h1>{name}</h1>
        </header>

        <section className={styles.gallery} aria-label="Photo du produit">
          <Dialog>
            <DialogTrigger asChild>
              <button type="button" className={styles.photo} disabled={imageFailed || !photo} aria-label={`Agrandir la photo de ${name}`}>
                {!imageFailed && photo ? <Image src={photo} alt={name} fill priority quality={90}
                  sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1279px) 50vw, 580px"
                  className={styles.productImage} onError={() => setImageFailed(true)} />
                  : <span className={styles.missing}><ImageOff size={30} aria-hidden="true" />Photo indisponible pour le moment</span>}
                {!imageFailed && photo && <span className={styles.zoomHint}><ZoomIn size={17} aria-hidden="true" />Agrandir</span>}
              </button>
            </DialogTrigger>
            <DialogContent className={styles.lightbox} showCloseButton={false}>
              <div className={styles.lightboxHeader}>
                <DialogTitle className={styles.lightboxTitle}>{name}</DialogTitle>
                <DialogClose asChild><button type="button" aria-label="Fermer la photo" className={styles.close}><X size={22} aria-hidden="true" /></button></DialogClose>
              </div>
              <DialogDescription className="sr-only">Photo agrandie du produit. Appuyez sur Échap pour fermer.</DialogDescription>
              <div className={styles.enlarged}><Image src={photo || "/logo-yodi-k.png"} alt={name} fill unoptimized sizes="90vw" className={styles.productImage} /></div>
            </DialogContent>
          </Dialog>
        </section>

        <section aria-label="Prix et achat" className={styles.purchase}>
          <div className={styles.price}>
            <p>{(product.discount ?? 0) > 0 && <s><span className="sr-only">Prix initial : </span>{formatMoney(product.price, currency, usdRate)}</s>}
              <strong>{(product.discount ?? 0) > 0 && <span className="sr-only">Prix réduit : </span>}{formatMoney(price, currency, usdRate)}</strong>
            </p>
            {(product.discount ?? 0) > 0 && <span className={styles.discount}>−{product.discount}%</span>}
          </div>
          {product.description && <p className={styles.excerpt}>{product.description}</p>}
          <a className={styles.more} href="#product-information">Découvrir ce soin <ChevronDown size={14} aria-hidden="true" /></a>

          <p className={styles.availability} data-available={!upcoming && product.stock > 0 || undefined}>
            <span aria-hidden="true" />{upcoming ? "Bientôt disponible" : product.stock > 0 ? "En stock" : "Actuellement en rupture de stock"}
          </p>

          {upcoming ? <div className={styles.notify}>
            <NotifyButton productId={id} productName={product.title} productImage={photo} variant="detail" />
            {waitingCount > 0 && <p>{waitingCount} personne{waitingCount > 1 ? "s attendent" : " attend"} ce produit.</p>}
          </div> : <>
            {product.stock > 0 && <div className={styles.quantityRow}>
              <span id="product-quantity-label">Quantité</span>
              <div className={styles.quantity} role="group" aria-labelledby="product-quantity-label">
                <button type="button" onClick={() => setRequestedQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1 || !canAdd} aria-label="Diminuer la quantité"><Minus size={17} aria-hidden="true" /></button>
                <output aria-live="polite" aria-label="Quantité choisie">{quantity}</output>
                <button type="button" onClick={() => setRequestedQuantity(quantity + 1)} disabled={!canAdd || quantity >= remaining} aria-label="Augmenter la quantité"><Plus size={17} aria-hidden="true" /></button>
              </div>
            </div>}
            <button type="button" className={styles.add} onClick={handleAdd} disabled={!canAdd}>
              {added ? <Check size={19} aria-hidden="true" /> : <ShoppingBag size={19} aria-hidden="true" />}
              {added ? "Ajouté au panier" : !canAdd ? product.stock > 0 ? "Quantité disponible déjà au panier" : "Produit épuisé" : "Ajouter au panier"}
            </button>
            <p className={styles.feedback} role="status" aria-live="polite">{added ? `${addedQuantity} article${addedQuantity > 1 ? "s" : ""} ajouté${addedQuantity > 1 ? "s" : ""} à votre panier.` : inCart > 0 ? `${inCart} article${inCart > 1 ? "s" : ""} déjà dans votre panier.` : ""}</p>
          </>}

          <WhatsAppOrderButton product={product} name={name} displayedPrice={formatMoney(price, currency, usdRate)} />

          <div className={styles.delivery}><Truck size={20} aria-hidden="true" /><div><strong>Livraison</strong><p>Les frais sont indiqués au moment de la commande.</p></div></div>
          {(product.brand || product.sku || product.etiquette) && <dl className={styles.references}>
            {product.brand && <div><dt>Marque</dt><dd>{product.brand}</dd></div>}
            {product.sku && <div><dt>Référence</dt><dd>{product.sku}</dd></div>}
            {product.etiquette && <div><dt>Étiquette</dt><dd>{product.etiquette}</dd></div>}
          </dl>}
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className={styles.advice}><MessageCircle size={17} aria-hidden="true" />Besoin d’un conseil ? <ArrowUpRight size={15} aria-hidden="true" /></a>
        </section>
      </div>

      <section id="product-information" aria-labelledby="product-information-title" className={styles.information}>
        <div><p className={styles.eyebrow}>Le soin, en détail</p><h2 id="product-information-title">À propos de<br className={styles.desktopBreak} /> ce soin</h2></div>
        <div className={styles.accordions}>
          {product.description && <details open><summary>Description <ChevronDown size={18} aria-hidden="true" /></summary><div className={styles.content}><p>{product.description}</p></div></details>}
          {!!product.benefits?.length && <details><summary>Les bénéfices <ChevronDown size={18} aria-hidden="true" /></summary><div className={styles.content}><ul>{product.benefits.map((benefit, index) => <li key={index}>{benefit}</li>)}</ul></div></details>}
          {product.usage && <details><summary>Conseils d’utilisation <ChevronDown size={18} aria-hidden="true" /></summary><div className={styles.content}><p>{product.usage}</p></div></details>}
          <details><summary>Livraison <ChevronDown size={18} aria-hidden="true" /></summary><div className={styles.content}><p>Les frais de livraison sont indiqués avant la confirmation de votre commande. Pour toute question, notre équipe est joignable au <a href={`tel:${PHONE_COMMERCIAL.tel}`}>{PHONE_COMMERCIAL.label}</a>.</p></div></details>
          <details><summary>Comment commander <ChevronDown size={18} aria-hidden="true" /></summary><div className={styles.content}><ol><li>Choisissez la quantité et ajoutez le produit au panier.</li><li>Renseignez vos informations de livraison.</li><li>Choisissez un moyen de paiement proposé.</li><li>Vérifiez le récapitulatif puis confirmez votre commande.</li></ol><Link href="/panier">Voir mon panier <ArrowUpRight size={14} aria-hidden="true" /></Link></div></details>
        </div>
      </section>
      <Link href={`/${product.category}`} className={styles.back}><ArrowLeft size={16} aria-hidden="true" />Retour à l’univers {categoryTitle}</Link>
    </div>
  </main>;
}
