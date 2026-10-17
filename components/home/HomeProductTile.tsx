"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Package, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { IProduct } from "@/lib/models/product";
import useStore from "@/lib/store-manage";
import { trackAddToCart, sendToCAPI } from "@/components/MetaPixel";
import NotifyButton from "@/components/NotifyButton";
import { formatProductName } from "@/lib/format";
import { discountedPrice, formatMoney, productHref } from "@/lib/pricing";
import { remainingProductQuantity } from "@/lib/product-quantity";
import styles from "./HomeProductTile.module.css";

export default function HomeProductTile({ product, categoryTitle }: { product: IProduct; categoryTitle: string }) {
  const addToCart = useStore(state => state.addToCart);
  const currency = useStore(state => state.selectedCurrency);
  const usdRate = useStore(state => state.usdRate);
  const id = String(product._id);
  const inCart = useStore(state => state.carts.filter(item => item.id === id).reduce((sum, item) => sum + item.quantity, 0));
  const [added, setAdded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const addedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const name = formatProductName(product.title);
  const discount = product.discount ?? 0;
  const finalPrice = discountedPrice(product.price, discount);
  const upcoming = product.disponible === false;
  const canAdd = !upcoming && remainingProductQuantity(product.stock, inCart) > 0;
  const photo = product.imageUrl && product.imageUrl !== "/logo-yodi-k.png" ? product.imageUrl : "";

  useEffect(() => () => { if (addedTimeout.current) clearTimeout(addedTimeout.current); }, []);

  const handleAddToCart = useCallback(() => {
    const cartQuantity = useStore.getState().carts.filter(item => item.id === id).reduce((sum, item) => sum + item.quantity, 0);
    if (product.disponible === false || remainingProductQuantity(product.stock, cartQuantity) < 1) {
      toast.error("La quantité disponible est déjà dans votre panier.");
      return;
    }
    addToCart({ ...product, quantity: 1, id });
    const eventId = trackAddToCart({ id, name: product.title, price: finalPrice, quantity: 1, currency });
    void sendToCAPI("AddToCart", {
      content_ids: [id], content_name: product.title, content_type: "product",
      value: finalPrice, currency, num_items: 1,
    }, eventId);
    setAdded(true);
    if (addedTimeout.current) clearTimeout(addedTimeout.current);
    addedTimeout.current = setTimeout(() => setAdded(false), 1600);
    toast.success("Produit ajouté au panier", { duration: 3000, position: "top-right" });
  }, [addToCart, product, id, finalPrice, currency]);

  return (
    <article className={styles.card}>
      <Link href={productHref(product)} className={styles.productLink}>
        <div className={styles.visual}>
          {photo && !imageFailed ? <Image
            src={photo} alt="" fill
            sizes="(max-width: 760px) 46vw, (max-width: 1264px) 32vw, 384px"
            className={`${styles.photo} ${upcoming ? styles.upcomingPhoto : ""}`}
            onError={() => setImageFailed(true)}
          /> : <span className={styles.fallback}><Package size={30} strokeWidth={1.2} aria-hidden="true" /><span>Visuel indisponible</span></span>}
          {upcoming ? <span className={`${styles.badge} ${styles.upcomingBadge}`}>Bientôt disponible</span> : discount > 0 && <span className={styles.badge}>−{discount}%</span>}
        </div>
        <div className={styles.details}>
          <p className={styles.category}>{categoryTitle}</p>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.price}>
            <span className={styles.currentPrice}><span className={styles.srOnly}>{discount > 0 ? "Prix réduit : " : "Prix : "}</span>{formatMoney(finalPrice, currency, usdRate)}</span>
            {discount > 0 && <s className={styles.oldPrice}><span className={styles.srOnly}>Prix initial : </span>{formatMoney(product.price, currency, usdRate)}</s>}
          </p>
        </div>
      </Link>
      <div className={styles.actions}>
        {upcoming ? <NotifyButton productId={id} productName={product.title} productImage={photo} variant="card" className={styles.notifyButton} /> : <button
          type="button" onClick={handleAddToCart} disabled={!canAdd}
          aria-label={canAdd ? `Ajouter ${name} au panier` : `Quantité maximale de ${name} atteinte dans le panier`}
          className={`${styles.add} ${added ? styles.added : ""}`}>
          {added ? <Check size={16} aria-hidden="true" /> : <ShoppingBag size={16} aria-hidden="true" />}
          {added ? "Ajouté" : canAdd ? "Ajouter au panier" : "Limite atteinte"}
        </button>}
      </div>
    </article>
  );
}
