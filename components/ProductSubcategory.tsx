"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { IProduct } from "@/lib/models/product";
import { categories } from "@/lib/sampledata";
import Image from "next/image";
import Link from "next/link";
import useStore from "@/lib/store-manage";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { trackAddToCart, sendToCAPI } from "@/components/MetaPixel";
import NotifyButton from "@/components/NotifyButton";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const ProductSubcategory = ({
  category,
  subcategory,
}: {
  category: string;
  subcategory: string;
}) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  // Pas besoin de selectedSubCategory car on affiche toujours la même sous-catégorie
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const categoryData = categories.find((cat) => cat.slug === category);
  const { addToCart, selectedCurrency, usdRate } = useStore();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Effet pour charger les produits initiaux quand la catégorie ou sous-catégorie change
  useEffect(() => {
    setProducts([]);
    setHasMoreProducts(true);

    const loadInitialProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          category,
          subCategory: subcategory, // Utiliser subCategory au lieu de subcategory
          page: "1",
          limit: "8",
        });

        console.log("Loading initial products with params:", params.toString());

        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();

        console.log("Initial API Response:", data);

        setProducts(data.products || []);
        setPagination(data.pagination);
        setHasMoreProducts(data.pagination?.hasNextPage || false);
      } catch (error) {
        console.error("Error loading initial products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialProducts();
  }, [category, subcategory]);

  // Fonction pour charger plus de produits
  const loadMoreProducts = useCallback(async () => {
    if (hasMoreProducts && !loadingMore && pagination) {
      try {
        setLoadingMore(true);
        const params = new URLSearchParams({
          category,
          subCategory: subcategory, // Utiliser subCategory au lieu de subcategory
          page: (pagination.currentPage + 1).toString(),
          limit: "8",
        });

        // console.log("Loading more products with params:", params.toString());

        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();

        // console.log("Load more API Response:", data);

        setProducts((prev) => [...prev, ...(data.products || [])]);
        setPagination(data.pagination);
        setHasMoreProducts(data.pagination?.hasNextPage || false);
      } catch (error) {
        console.error("Error loading more products:", error);
      } finally {
        setLoadingMore(false);
      }
    }
  }, [hasMoreProducts, loadingMore, pagination, category, subcategory]);

  // Configuration de l'Intersection Observer pour la pagination infinie
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreProducts && !loadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMoreProducts, loadingMore, loadMoreProducts]);

  const handleAddToCart = (product: IProduct) => {
    const newProduct = { ...product, quantity: 1, id: product._id as string };
    addToCart(newProduct);

    // Meta Pixel: Track AddToCart event
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

    // Send to CAPI for better tracking reliability
    sendToCAPI("AddToCart", {
      content_ids: [product._id as string],
      content_name: product.title,
      content_type: "product",
      value: finalPrice,
      currency: selectedCurrency,
      num_items: 1,
    }, eventId);

    toast.success("Produit ajouté au panier", {
      duration: 3000,
      style: {
        color: "#10b981",
      },
      position: "top-right",
    });
  };

  return (
    <div className="w-full flex flex-col py-10 mx-auto max-w-7xl font-josefin px-4">
      <div className="flex items-end justify-end gap-2 text-xs text-gray-600 mb-6 ">
        <Link href="/">Accueil</Link> /{" "}
        <Link href={`/${category}`}>{category}</Link> /{" "}
        <Link href={`/${category}/${subcategory}`}>{subcategory}</Link>
      </div>

      <h1 className="text-2xl lg:text-3xl font-bold text-black mb-4">
        {categoryData?.title}
      </h1>

      {/* Affichage de la sous-catégorie actuelle */}
      <div className="w-full my-6">
        <div className="bg-[#A36F5E] text-white px-4 py-2 rounded-lg mb-4">
          <span className="text-sm">
            <strong>
              {categoryData?.subcategories?.find(
                (sub) => sub.slug === subcategory
              )?.title || subcategory}
            </strong>
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12 mb-6">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col h-full">
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-72 h-64 bg-gray-200 animate-pulse rounded-md">
                  <Skeleton className="w-72 h-64" />
                  <Skeleton className="w-72 h-4" />
                  <Skeleton className="w-72 h-4" />
                </div>
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
          ))
          : products.map((product) => {
            const indisponible = product.disponible === false;
            return (
            <Link
              href={`/${category}/${subcategory}/${product._id}`}
              key={product._id as string}
              className="flex flex-col h-full group"
            >
              {/* Contenu principal avec flex-1 pour occuper l'espace disponible */}
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    width={220}
                    height={220}
                    className={`w-72 h-64 object-cover object-center ${indisponible ? "grayscale opacity-90" : ""}`}
                  />
                  {indisponible && (
                    <span className="absolute top-2 left-2 bg-[#FF9800] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm font-josefin">
                      BIENTÔT DISPONIBLE
                    </span>
                  )}
                </div>
                <p className="text-black text-sm font-josefin text-center">
                  {product.title}
                </p>
                <p className="text-black text-xs font-josefin text-center line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-2">
                  {(product.discount ?? 0) > 0 && (
                    <span className="text-gray-400 line-through text-sm font-josefin">
                      {selectedCurrency === "XOF" ? product.price : Number(product.price / Number(usdRate || 1)).toFixed(2)} {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                    </span>
                  )}
                  <span className="text-[#A36F5E] text-xl font-josefin font-bold">
                    {selectedCurrency === "XOF"
                      ? Math.round(product.price - (product.price * (product.discount ?? 0)) / 100)
                      : Number((product.price - (product.price * (product.discount ?? 0)) / 100) / Number(usdRate || 1)).toFixed(2)}{" "}
                    {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                  </span>
                </div>
              </div>

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
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className="bg-[#A36F5E] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-josefin font-medium w-full transition-all duration-300 hover:bg-[#916253]"
                  >
                    Ajouter au panier
                  </button>
                )}
              </div>
            </Link>
            );
          })}
      </div>

      {/* Élément de déclenchement pour la pagination infinie */}
      {hasMoreProducts && !loading && (
        <div ref={loadMoreRef} className="w-full flex justify-center py-8">
          {loadingMore ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-[#A36F5E] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">
                Chargement de plus de produits...
              </span>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Faites défiler vers le bas pour charger plus de produits
            </div>
          )}
        </div>
      )}

      {/* Skeletons de chargement pour la pagination infinie */}
      {loadingMore && (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12 mb-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`loading-skeleton-${index}`}
              className="flex flex-col h-full"
            >
              <div className="flex-1 flex flex-col items-center gap-3">
                <Skeleton className="w-72 h-64" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-3" />
                <div className="flex items-center gap-2 w-full">
                  <Skeleton className="w-16 h-6" />
                  <Skeleton className="w-20 h-6" />
                </div>
                <Skeleton className="w-full h-10 mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message quand il n'y a plus de produits */}
      {!hasMoreProducts && products.length > 0 && (
        <div className="w-full text-center py-8">
          <span className="text-sm text-gray-500">
            Tous les produits ont été chargés ({pagination?.totalProducts}{" "}
            produit{pagination?.totalProducts !== 1 ? "s" : ""})
          </span>
        </div>
      )}

      {/* Message quand aucun produit n'est trouvé */}
      {!loading && products.length === 0 && (
        <div className="w-full text-center py-8">
          <span className="text-sm text-gray-500">
            Aucun produit trouvé pour la sous-catégorie &quot;
            {categoryData?.subcategories?.find(
              (sub) => sub.slug === subcategory
            )?.title || subcategory}
            &quot;
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductSubcategory;
