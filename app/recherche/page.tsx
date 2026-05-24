"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { IProduct } from "@/lib/models/product";
import useStore from "@/lib/store-manage";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import NotifyButton from "@/components/NotifyButton";
import { trackAddToCart, sendToCAPI } from "@/components/MetaPixel";
import { PHONE_COMMERCIAL } from "@/lib/site";

const SearchResults = () => {
  const q = (useSearchParams().get("q") || "").trim();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToCart, selectedCurrency, usdRate } = useStore();

  useEffect(() => {
    if (!q) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=24`);
        const data = await res.json();
        if (!cancelled) setProducts(data.products || []);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [q]);

  const handleAddToCart = (product: IProduct) => {
    addToCart({ ...product, quantity: 1, id: product._id as string });
    const finalPrice =
      product.discount && product.discount > 0
        ? product.price - (product.price * product.discount) / 100
        : product.price;
    const eventId = trackAddToCart({
      id: product._id as string,
      name: product.title,
      price: finalPrice,
      quantity: 1,
      currency: selectedCurrency,
    });
    sendToCAPI(
      "AddToCart",
      {
        content_ids: [product._id as string],
        content_name: product.title,
        content_type: "product",
        value: finalPrice,
        currency: selectedCurrency,
        num_items: 1,
      },
      eventId
    );
    toast.success("Produit ajouté au panier", {
      duration: 3000,
      style: { color: "#10b981" },
      position: "top-right",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 font-josefin min-h-[50vh]">
      <h1 className="text-xl md:text-2xl font-bold text-black mb-2">
        {q ? (
          <>
            Résultats pour <span className="text-[#A36F5E]">«&nbsp;{q}&nbsp;»</span>
          </>
        ) : (
          "Rechercher un produit"
        )}
      </h1>

      {q && !loading && (
        <p className="text-sm text-gray-500 mb-6">
          {products.length} produit{products.length > 1 ? "s" : ""} trouvé
          {products.length > 1 ? "s" : ""}
        </p>
      )}

      {/* Chargement */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="w-full h-64" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      )}

      {/* Aucun résultat */}
      {!loading && q && products.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-16 gap-3">
          <Search className="w-12 h-12 text-gray-300" />
          <p className="text-gray-700">
            Aucun produit ne correspond à «&nbsp;{q}&nbsp;».
          </p>
          <p className="text-sm text-gray-500">
            Essaie avec un autre mot-clé ou contacte-nous au{" "}
            <a href={`tel:${PHONE_COMMERCIAL.tel}`} className="text-[#A36F5E] font-medium hover:underline">
              {PHONE_COMMERCIAL.label}
            </a>
            .
          </p>
        </div>
      )}

      {/* Résultats */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12">
          {products.map((product) => {
            const indisponible = product.disponible === false;
            const productUrl = product.subCategory
              ? `/${product.category}/${product.subCategory}`
              : `/${product.category}/product/${product._id}`;
            return (
              <div key={String(product._id)} className="flex flex-col h-full group">
                <Link href={productUrl} className="flex-1 flex flex-col items-center gap-3">
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      width={220}
                      height={220}
                      className={`w-72 h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105 ${
                        indisponible ? "grayscale opacity-90" : ""
                      }`}
                    />
                    {indisponible && (
                      <span className="absolute top-2 left-2 bg-[#FF9800] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        BIENTÔT DISPONIBLE
                      </span>
                    )}
                  </div>
                  <p className="text-black text-sm text-center group-hover:text-[#A36F5E] transition-colors">
                    {product.title}
                  </p>
                  <div className="flex items-center gap-2">
                    {(product.discount ?? 0) > 0 && (
                      <span className="text-gray-400 line-through text-sm">
                        {selectedCurrency === "XOF" ? product.price : Number(product.price / Number(usdRate || 1)).toFixed(2)} {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                      </span>
                    )}
                    <span className="text-[#A36F5E] text-xl font-bold">
                      {selectedCurrency === "XOF"
                        ? Math.round(product.price - (product.price * (product.discount ?? 0)) / 100)
                        : Number((product.price - (product.price * (product.discount ?? 0)) / 100) / Number(usdRate || 1)).toFixed(2)}{" "}
                      {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                    </span>
                  </div>
                </Link>
                <div className="mt-auto pt-4">
                  {indisponible ? (
                    <NotifyButton
                      productId={String(product._id)}
                      productName={product.title}
                      productImage={product.imageUrl}
                      variant="card"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="bg-[#A36F5E] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium w-full transition-all duration-300 hover:bg-[#916253]"
                    >
                      Ajouter au panier
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RecherchePage = () => (
  <Suspense fallback={<div className="min-h-[50vh]" />}>
    <SearchResults />
  </Suspense>
);

export default RecherchePage;
