"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import type { IProduct } from "@/lib/models/product";
import HomeProductCard from "@/components/home/HomeProductCard";
import styles from "./ProductCategory.module.css";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

type Props = {
  category: string;
  title: string;
  initialData: { products: IProduct[]; pagination: PaginationInfo };
  subcategories: { slug: string; title: string }[];
  selectedSubcategory: string | null;
  sort: string;
};

export default function ProductCategory({ category, title, initialData, subcategories, selectedSubcategory, sort }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initialData.products);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [availability, setAvailability] = useState("all");
  const lock = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const selected = subcategories.find((sub) => sub.slug === selectedSubcategory);
  const total = pagination.totalProducts;
  const hasUpcoming = products.some((product) => product.disponible === false);
  const displayed = products.filter((product) => availability === "all"
    || (availability === "available" ? product.disponible !== false : product.disponible === false));

  const hrefFor = (sub: string | null, order = sort) => {
    const params = new URLSearchParams();
    if (sub) params.set("soin", sub);
    if (order !== "newest") params.set("tri", order);
    return `/${category}${params.size ? `?${params}` : ""}`;
  };

  const loadMore = useCallback(async () => {
    if (lock.current || !pagination.hasNextPage) return;
    lock.current = true;
    const request = new AbortController();
    controller.current = request;
    setLoadingMore(true);
    setError(false);
    try {
      const params = new URLSearchParams({ category, sort, page: String(pagination.currentPage + 1), limit: "8" });
      if (selectedSubcategory) params.set("subCategory", selectedSubcategory);
      const response = await fetch(`/api/products?${params}`, { signal: request.signal });
      if (!response.ok) throw new Error("Products request failed");
      const data = await response.json();
      if (request.signal.aborted) return;
      setProducts((previous) => {
        const known = new Set(previous.map((product) => String(product._id)));
        return [...previous, ...data.products.filter((product: IProduct) => !known.has(String(product._id)))];
      });
      setPagination(data.pagination);
    } catch {
      if (!request.signal.aborted) setError(true);
    } finally {
      if (!request.signal.aborted) { lock.current = false; setLoadingMore(false); }
    }
  }, [category, selectedSubcategory, sort, pagination]);

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (!pagination.hasNextPage || error || loadingMore || !sentinel.current) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) void loadMore(); }, { rootMargin: "120px" });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [loadMore, pagination.hasNextPage, error, loadingMore]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav aria-label="Fil d’Ariane" className={styles.breadcrumb}>
          <ol><li><Link href="/">Accueil</Link></li><li><ChevronRight size={12} aria-hidden="true" /><Link href="/categories">Boutique</Link></li><li><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">{title}</span></li></ol>
        </nav>

        <header className={styles.heading}>
          <div><p className={styles.eyebrow}>Maison Yodi-K · La boutique</p><h1>{title}</h1></div>
          <div className={styles.intro}><p>Explorez nos soins, à votre rythme.</p><Link href="/categories">Tous nos univers <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        </header>

        <section aria-label="Catalogue et filtres" className={styles.catalog}>
          <div className={styles.toolbar}>
            <div className={styles.filters} aria-label="Filtrer par sous-catégorie">
              <Link href={hrefFor(null)} className={styles.filter} aria-current={!selected ? "true" : undefined}>Tous les produits</Link>
              {subcategories.map((sub) => <Link key={sub.slug} href={hrefFor(sub.slug)} className={styles.filter}
                aria-current={selectedSubcategory === sub.slug ? "true" : undefined}>{sub.title}</Link>)}
            </div>
            <div className={styles.sort}>
              <SlidersHorizontal size={15} aria-hidden="true" />
              <label htmlFor="category-sort">Trier par</label>
              <select id="category-sort" value={sort} onChange={(event) => router.push(hrefFor(selectedSubcategory, event.target.value), { scroll: false })}>
                <option value="newest">Les plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {hasUpcoming && <div role="group" aria-label="Disponibilité des produits chargés" className={styles.availability}>
            {[["all", "Tous"], ["available", "Disponibles"], ["soon", "Bientôt disponibles"]].map(([key, label]) =>
              <button type="button" key={key} aria-pressed={availability === key} onClick={() => setAvailability(key)}>{label}</button>)}
          </div>}

          <div className={styles.results}>
            <p role="status" aria-live="polite">{availability === "all" ? <><strong>{total}</strong> produit{total !== 1 ? "s" : ""}{selected ? ` · ${selected.title}` : ""}</>
              : <>{displayed.length} produit{displayed.length !== 1 ? "s" : ""} affiché{displayed.length !== 1 ? "s" : ""} parmi les produits chargés</>}</p>
            {selected && <Link href={hrefFor(null)} className={styles.clear}>Effacer le filtre <X size={14} aria-hidden="true" /></Link>}
          </div>

          <ul className={styles.grid} aria-label="Produits" aria-busy={loadingMore}>
            {displayed.map((product, index) => <li key={String(product._id)}><HomeProductCard product={product} priority={index < 2} /></li>)}
          </ul>

          {displayed.length === 0 && <div className={styles.empty}>
            <h2>Aucun produit à afficher</h2>
            <p>Essayez une autre sélection pour retrouver nos soins.</p>
            {availability !== "all" ? <button type="button" onClick={() => setAvailability("all")}>Afficher toutes les disponibilités</button>
              : <Link href={hrefFor(null)}>Voir tous les produits <ArrowUpRight size={16} aria-hidden="true" /></Link>}
          </div>}

          <div ref={sentinel} className={styles.pagination}>
            {error && <p role="alert">La suite du catalogue n’a pas pu être chargée. Vous pouvez réessayer.</p>}
            {pagination.hasNextPage && <button type="button" onClick={() => void loadMore()} disabled={loadingMore}>
              {loadingMore ? "Chargement…" : error ? "Réessayer" : "Voir plus de produits"}
            </button>}
            {!pagination.hasNextPage && products.length > 0 && <p>Vous avez découvert tous les produits{selected ? " de cette sélection" : " de cet univers"}.</p>}
            <Link className={styles.back} href="/categories"><ArrowLeft size={16} aria-hidden="true" /> Explorer les autres univers</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
