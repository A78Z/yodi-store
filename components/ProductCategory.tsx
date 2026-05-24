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

const ProductCategory = ({ category }: { category: string }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "available" | "soon"
  >("all");
  const categoryData = categories.find((cat) => cat.slug === category);
  const { addToCart, selectedCurrency, usdRate } = useStore();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Effet pour charger les produits initiaux quand la catégorie change
  useEffect(() => {
    setProducts([]);
    setSelectedSubCategory(null);
    setHasMoreProducts(true);
    // Appel direct sans dépendance pour éviter la boucle
    const loadInitialProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          category,
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
  }, [category]);

  // Effet pour recharger quand la sous-catégorie change
  useEffect(() => {
    if (selectedSubCategory === null) return; // Éviter l'appel initial

    setProducts([]);
    setHasMoreProducts(true);

    // Appel direct sans dépendance pour éviter la boucle
    const loadFilteredProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          category,
          page: "1",
          limit: "8",
        });

        if (selectedSubCategory && selectedSubCategory !== "all") {
          params.append("subCategory", selectedSubCategory);
        }

        console.log(
          "Loading filtered products with params:",
          params.toString()
        );

        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();

        console.log("Filtered API Response:", data);

        setProducts(data.products || []);
        setPagination(data.pagination);
        setHasMoreProducts(data.pagination?.hasNextPage || false);
      } catch (error) {
        console.error("Error loading filtered products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFilteredProducts();
  }, [selectedSubCategory, category]);

  // Fonction pour charger plus de produits
  const loadMoreProducts = useCallback(async () => {
    if (hasMoreProducts && !loadingMore && pagination) {
      try {
        setLoadingMore(true);
        const params = new URLSearchParams({
          category,
          page: (pagination.currentPage + 1).toString(),
          limit: "8",
        });

        if (selectedSubCategory && selectedSubCategory !== "all") {
          params.append("subCategory", selectedSubCategory);
        }

        console.log("Loading more products with params:", params.toString());

        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();

        console.log("Load more API Response:", data);

        setProducts((prev) => [...prev, ...(data.products || [])]);
        setPagination(data.pagination);
        setHasMoreProducts(data.pagination?.hasNextPage || false);
      } catch (error) {
        console.error("Error loading more products:", error);
      } finally {
        setLoadingMore(false);
      }
    }
  }, [hasMoreProducts, loadingMore, pagination, category, selectedSubCategory]);

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

  // Fonction pour gérer le clic sur une sous-catégorie
  const handleSubCategoryClick = (subCategorySlug: string) => {
    console.log(
      "Clicked subcategory:",
      subCategorySlug,
      "Current:",
      selectedSubCategory
    );
    setSelectedSubCategory(
      selectedSubCategory === subCategorySlug ? null : subCategorySlug
    );
  };

  // Fonction pour réinitialiser le filtre
  const resetFilter = () => {
    console.log("Resetting filter");
    setSelectedSubCategory(null);
  };

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

  // Disponibles d'abord, puis "Bientôt disponible" — avec filtre de disponibilité.
  const displayedProducts = [...products]
    .sort(
      (a, b) =>
        (a.disponible !== false ? 0 : 1) - (b.disponible !== false ? 0 : 1)
    )
    .filter((p) => {
      if (availabilityFilter === "available") return p.disponible !== false;
      if (availabilityFilter === "soon") return p.disponible === false;
      return true;
    });

  const soonCount = products.filter((p) => p.disponible === false).length;

  return (
    <div className="w-full flex flex-col items-start py-10 mx-auto max-w-7xl font-josefin px-4">
      <h1 className="text-2xl lg:text-3xl font-bold text-black mb-4">
        {categoryData?.title}
      </h1>

      {/* Filtre de disponibilité (affiché seulement s'il y a des produits "bientôt") */}
      {soonCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtrer par disponibilité">
          {([
            { key: "all", label: "Tous" },
            { key: "available", label: "Disponibles maintenant" },
            { key: "soon", label: `Bientôt disponibles (${soonCount})` },
          ] as const).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setAvailabilityFilter(opt.key)}
              aria-pressed={availabilityFilter === opt.key}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                availabilityFilter === opt.key
                  ? "bg-[#A36F5E] text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
      {categoryData?.subcategories && (
        <div className="w-full my-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={resetFilter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedSubCategory === null
                ? "bg-[#A36F5E] text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              📋 Tous ({pagination?.totalProducts || 0})
            </button>
            {categoryData?.subcategories?.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => handleSubCategoryClick(subcategory.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedSubCategory === subcategory.slug
                  ? "bg-[#A36F5E] text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {subcategory.title}
              </button>
            ))}
          </div>

          {/* Indicateur de filtre actif */}
          {selectedSubCategory && (
            <div className="bg-[#A36F5E] text-white px-4 py-2 rounded-lg mb-4 flex items-center justify-between">
              <span className="text-sm">
                🔍 Filtrage par:{" "}
                <strong>
                  {
                    categoryData?.subcategories?.find(
                      (sub) => sub.slug === selectedSubCategory
                    )?.title
                  }
                </strong>
              </span>
              <button
                onClick={resetFilter}
                className="text-white hover:text-gray-200 text-sm underline"
              >
                Effacer le filtre
              </button>
            </div>
          )}
        </div>
      )}

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
          : displayedProducts.map((product, index) => {
            // Construire l'URL de manière sécurisée - JAMAIS de fallback vers la catégorie seule
            const productUrl = product.subCategory
              ? `/${category}/${product.subCategory}`
              : `/${category}/product/${product._id}`; // Fallback vers page produit par ID

            const indisponible = product.disponible === false;

            return (
              <div
                key={`${product._id}-${index}`}
                className="flex flex-col h-full group"
              >
                {/* Zone cliquable pour la navigation (image + texte) */}
                <Link
                  href={productUrl}
                  className="flex-1 flex flex-col items-center gap-3 cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      width={220}
                      height={220}
                      className={`w-72 h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105 ${indisponible ? "grayscale opacity-90" : ""}`}
                    />
                    {indisponible && (
                      <span className="absolute top-2 left-2 bg-[#FF9800] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm font-josefin">
                        BIENTÔT DISPONIBLE
                      </span>
                    )}
                  </div>
                  <p className="text-black text-sm font-josefin text-center group-hover:text-[#A36F5E] transition-colors">
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
                </Link>

                {/* Bouton séparé - PAS dans le Link */}
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
                      className="bg-[#A36F5E] cursor-pointer text-white px-4 py-2 rounded-md text-sm font-josefin font-medium w-full transition-all duration-300 hover:bg-[#916253]"
                    >
                      Ajouter au panier
                    </button>
                  )}
                </div>
              </div>
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
            <div key={`loading-skeleton-${index}`} className="flex flex-col h-full">
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
            {selectedSubCategory
              ? `Aucun produit trouvé pour la sous-catégorie "${categoryData?.subcategories?.find((sub) => sub.slug === selectedSubCategory)?.title}"`
              : "Aucun produit trouvé pour cette catégorie"}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
