"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { IProduct } from "@/lib/models/product";
import useStore from "@/lib/store-manage";
import { trackAddToCart, sendToCAPI } from "@/components/MetaPixel";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import NotifyButton from "@/components/NotifyButton";
import { formatProductName } from "@/lib/format";
import { discountedPrice, formatMoney, productHref } from "@/lib/pricing";

const HomeProductCard = ({ product, priority = false }: { product: IProduct; priority?: boolean }) => {
  const addToCart = useStore((state) => state.addToCart);
  const currency = useStore((state) => state.selectedCurrency);
  const usdRate = useStore((state) => state.usdRate);
  const [added, setAdded] = useState(false);
  const addedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const id = String(product._id);
  const name = formatProductName(product.title);
  const discount = product.discount ?? 0;
  const finalPrice = discountedPrice(product.price, discount);
  const indisponible = product.disponible === false;

  useEffect(() => () => {
    if (addedTimeout.current) clearTimeout(addedTimeout.current);
  }, []);

  // Même comportement que le carrousel actuel (panier + événements Meta).
  const handleAddToCart = useCallback(() => {
    addToCart({ ...product, quantity: 1, id } as Parameters<typeof addToCart>[0]);
    const eventId = trackAddToCart({ id, name: product.title, price: finalPrice, quantity: 1, currency });
    sendToCAPI("AddToCart", {
      content_ids: [id],
      content_name: product.title,
      content_type: "product",
      value: finalPrice,
      currency,
      num_items: 1,
    }, eventId);
    setAdded(true);
    if (addedTimeout.current) clearTimeout(addedTimeout.current);
    addedTimeout.current = setTimeout(() => setAdded(false), 1600);
    toast.success("Produit ajouté au panier", { duration: 3000, position: "top-right" });
  }, [addToCart, product, id, finalPrice, currency]);

  return (
    <article className="group flex h-full flex-col">
      <Link href={productHref(product)} className="flex flex-1 flex-col focus-visible:outline-none">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sable ring-terracotta ring-offset-2 ring-offset-ivoire group-focus-within:ring-2">
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${indisponible ? "grayscale" : ""}`}
          />
          {indisponible ? (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-cacao px-2.5 py-1 font-dmsans text-[11px] font-medium text-ivoire">
              Bientôt disponible
            </span>
          ) : discount > 0 && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-terracotta px-2.5 py-1 font-dmsans text-xs font-medium text-ivoire">
              -{discount}%
            </span>
          )}
        </div>
        <h3 className="mt-3 line-clamp-2 font-dmsans text-sm leading-snug text-cacao md:text-base">{name}</h3>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 font-dmsans">
          {discount > 0 && (
            <s className="text-xs text-cacao-doux md:text-sm">
              <span className="sr-only">Prix initial : </span>
              {formatMoney(product.price, currency, usdRate)}
            </s>
          )}
          <span className="text-[15px] font-medium text-terracotta-fonce md:text-base">
            {discount > 0 && <span className="sr-only">Prix réduit : </span>}
            {formatMoney(finalPrice, currency, usdRate)}
          </span>
        </p>
      </Link>

      <div className="mt-3">
        {indisponible ? (
          <NotifyButton productId={id} productName={product.title} productImage={product.imageUrl} variant="card" />
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Ajouter ${name} au panier`}
            className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full font-dmsans text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${added ? "bg-sauge text-ivoire" : "border border-terracotta text-terracotta-fonce hover:bg-terracotta hover:text-ivoire"}`}
          >
            {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <ShoppingBag className="h-4 w-4" aria-hidden="true" />}
            {added ? "Ajouté" : "Ajouter"}
          </button>
        )}
        <WhatsAppOrderButton product={product} name={name} displayedPrice={formatMoney(finalPrice, currency, usdRate)} />
      </div>
    </article>
  );
};

export default HomeProductCard;
