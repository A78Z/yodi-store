"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/lib/models/product";
import useStore from "@/lib/store-manage";
import { toast } from "sonner";
import { trackAddToCart, sendToCAPI } from "@/components/MetaPixel";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Check, ArrowRight } from "lucide-react";
import NotifyButton from "@/components/NotifyButton";
import { formatProductName } from "@/lib/format";

interface ProductCarouselProps {
    initialProducts: IProduct[];
}

const FAVORITES_KEY = "yodi-favorites";

const ProductCarousel = ({ initialProducts }: ProductCarouselProps) => {
    const [products] = useState<IProduct[]>(initialProducts);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [addedId, setAddedId] = useState<string | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const addedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { addToCart, selectedCurrency, usdRate } = useStore();

    const [visibleCards, setVisibleCards] = useState(4);

    // Favoris : chargés depuis localStorage (persistance simple, v1)
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
            if (Array.isArray(saved)) setFavorites(new Set(saved));
        } catch {
            /* ignore */
        }
    }, []);

    const toggleFavorite = useCallback((id: string) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            try {
                localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
            } catch {
                /* ignore */
            }
            return next;
        });
    }, []);

    // Responsive
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) setVisibleCards(1);
            else if (width < 1024) setVisibleCards(2);
            else setVisibleCards(4);
        };
        handleResize();
        window.addEventListener("resize", handleResize, { passive: true });
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Auto-play (pause on hover)
    useEffect(() => {
        if (isPaused || products.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = Math.max(0, products.length - visibleCards);
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [isPaused, products.length, visibleCards]);

    useEffect(() => () => {
        if (addedTimeout.current) clearTimeout(addedTimeout.current);
    }, []);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev <= 0 ? Math.max(0, products.length - visibleCards) : prev - 1));
    }, [products.length, visibleCards]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => {
            const maxIndex = Math.max(0, products.length - visibleCards);
            return prev >= maxIndex ? 0 : prev + 1;
        });
    }, [products.length, visibleCards]);

    const handleAddToCart = useCallback((product: IProduct) => {
        const newProduct = { ...product, quantity: 1, id: product._id as string };
        addToCart(newProduct);

        const finalPrice = product.discount
            ? product.price - (product.price * product.discount) / 100
            : product.price;
        const eventId = trackAddToCart({
            id: product._id as string,
            name: product.title,
            price: finalPrice,
            quantity: 1,
            currency: selectedCurrency,
        });
        sendToCAPI("AddToCart", {
            content_ids: [product._id as string],
            content_name: product.title,
            content_type: "product",
            value: finalPrice,
            currency: selectedCurrency,
            num_items: 1,
        }, eventId);

        // Confirmation visuelle "✓ Ajouté" sur le bouton
        setAddedId(product._id as string);
        if (addedTimeout.current) clearTimeout(addedTimeout.current);
        addedTimeout.current = setTimeout(() => setAddedId(null), 1600);

        toast.success("Produit ajouté au panier", {
            duration: 3000,
            style: { color: "#10b981" },
            position: "top-right",
        });
    }, [addToCart, selectedCurrency]);

    const visibleProductIndices = useMemo(() => {
        const indices = new Set<number>();
        for (let i = currentIndex; i < currentIndex + visibleCards && i < products.length; i++) {
            indices.add(i);
        }
        if (currentIndex + visibleCards < products.length) {
            indices.add(currentIndex + visibleCards);
        }
        return indices;
    }, [currentIndex, visibleCards, products.length]);

    const maxIndex = Math.max(0, products.length - visibleCards);

    if (products.length === 0) return null;

    return (
        <section className="w-full bg-[#FAF7F4] py-12 md:py-16" aria-label="Nos produits les plus appréciés">
            {/* En-tête */}
            <div className="max-w-2xl mx-auto text-center px-4 mb-8 md:mb-12">
                <h2 className="font-playfair text-2xl md:text-4xl font-bold text-[#A36F5E] leading-tight">
                    Nos huiles &amp; soins les plus appréciés
                </h2>
                <p className="font-josefin text-sm md:text-base text-gray-500 mt-3">
                    Plébiscités par notre communauté Yodi-K
                </p>
            </div>

            {/* Carrousel */}
            <div
                className="max-w-7xl mx-auto px-4 relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Flèches */}
                <button
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                    className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-[#A36F5E] hover:text-white text-[#A36F5E] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#A36F5E] p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 hidden sm:flex"
                    aria-label="Produits précédents"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <button
                    onClick={goToNext}
                    disabled={currentIndex >= maxIndex}
                    className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-[#A36F5E] hover:text-white text-[#A36F5E] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#A36F5E] p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 hidden sm:flex"
                    aria-label="Produits suivants"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Track */}
                <div className="overflow-hidden px-1">
                    <div
                        ref={carouselRef}
                        className="flex will-change-transform"
                        style={{
                            transform: `translate3d(-${currentIndex * (100 / visibleCards)}%, 0, 0)`,
                            transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    >
                        {products.map((product, index) => {
                            const productUrl = product.subCategory
                                ? `/${product.category}/${product.subCategory}`
                                : `/${product.category}/product/${product._id}`;
                            const finalPrice = product.discount && product.discount > 0
                                ? product.price - (product.price * product.discount) / 100
                                : product.price;
                            const indisponible = product.disponible === false;
                            const discount = product.discount ?? 0;
                            const id = String(product._id);
                            const isFav = favorites.has(id);
                            const isAdded = addedId === id;
                            const isPriorityImage = index < visibleCards;
                            const isInViewport = visibleProductIndices.has(index);

                            return (
                                <article
                                    key={id}
                                    className="flex-shrink-0 px-2 md:px-3 group"
                                    style={{ width: `${100 / visibleCards}%` }}
                                >
                                    <div className="relative bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_rgba(163,111,94,0.15)] transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col">
                                        <Link
                                            href={productUrl}
                                            className="flex-1 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A36F5E] rounded-t-2xl"
                                            prefetch={isPriorityImage}
                                        >
                                            <div className="relative w-full aspect-square overflow-hidden bg-[#F5F1ED]">
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={formatProductName(product.title)}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${indisponible ? "grayscale opacity-90" : ""}`}
                                                    priority={isPriorityImage}
                                                    loading={isPriorityImage ? undefined : "lazy"}
                                                    placeholder="blur"
                                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
                                                    decoding={isInViewport ? "async" : "async"}
                                                />

                                                {/* Badge promo (pastille) ou Bientôt disponible */}
                                                {indisponible ? (
                                                    <span className="absolute top-3 left-3 bg-[#FF9800] text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                                        BIENTÔT DISPONIBLE
                                                    </span>
                                                ) : discount > 0 && (
                                                    <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${discount >= 15 ? "bg-red-600" : "bg-[#A36F5E]"}`}>
                                                        -{discount}%
                                                    </span>
                                                )}
                                            </div>

                                            <div className="p-4 flex-1 flex flex-col">
                                                <h3 className="font-josefin font-semibold text-sm text-gray-800 line-clamp-2 mb-2 min-h-[2.6em] group-hover:text-[#A36F5E] transition-colors">
                                                    {formatProductName(product.title)}
                                                </h3>
                                                <div className="flex items-baseline gap-2 mt-auto">
                                                    {discount > 0 && (
                                                        <span className="text-gray-400 line-through text-sm font-josefin">
                                                            {selectedCurrency === "XOF"
                                                                ? product.price
                                                                : Number(product.price / Number(usdRate || 1)).toFixed(2)} {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                                                        </span>
                                                    )}
                                                    <span className="text-[#A36F5E] font-bold text-lg font-josefin">
                                                        {selectedCurrency === "XOF"
                                                            ? Math.round(finalPrice)
                                                            : Number(finalPrice / Number(usdRate || 1)).toFixed(2)} {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Bouton favori (hors du Link) */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFavorite(id);
                                            }}
                                            aria-label={isFav ? `Retirer ${formatProductName(product.title)} des favoris` : `Ajouter ${formatProductName(product.title)} aux favoris`}
                                            aria-pressed={isFav}
                                            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                                        >
                                            <Heart className={`w-[18px] h-[18px] transition-colors ${isFav ? "text-red-600 fill-red-600" : "text-gray-400"}`} />
                                        </button>

                                        {/* Panier (dispo) ou "Me prévenir" (bientôt) */}
                                        <div className="px-4 pb-4">
                                            {indisponible ? (
                                                <NotifyButton
                                                    productId={id}
                                                    productName={product.title}
                                                    productImage={product.imageUrl}
                                                    variant="card"
                                                />
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddToCart(product)}
                                                    className={`w-full inline-flex items-center justify-center gap-2 text-white font-josefin font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 text-sm active:scale-[0.98] ${isAdded ? "bg-emerald-600" : "bg-[#A36F5E] hover:bg-[#916253]"}`}
                                                >
                                                    {isAdded ? (
                                                        <>
                                                            <Check className="w-4 h-4" /> Ajouté
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShoppingCart className="w-4 h-4" /> Ajouter au panier
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Dots */}
            {maxIndex > 0 && (
                <nav className="flex justify-center gap-2 mt-8" aria-label="Navigation du carrousel">
                    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-[#A36F5E] w-8" : "bg-gray-300 hover:bg-gray-400 w-2.5"}`}
                            aria-label={`Aller à la page ${index + 1}`}
                            aria-current={index === currentIndex ? "true" : undefined}
                        />
                    ))}
                </nav>
            )}

            {/* CTA global */}
            <div className="flex justify-center mt-10">
                <Link
                    href="/huile"
                    className="group inline-flex items-center gap-2 rounded-full border-2 border-[#A36F5E] text-[#A36F5E] hover:bg-[#A36F5E] hover:text-white font-josefin font-semibold px-8 py-3.5 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A36F5E] focus-visible:ring-offset-2"
                >
                    Voir tous les produits
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
};

export default ProductCarousel;
