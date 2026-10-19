"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight, RefreshCw, Search, SearchX } from "lucide-react";
import type { IProduct } from "@/lib/models/product";
import { categoryLabel } from "@/lib/category-label";
import { PHONE_COMMERCIAL } from "@/lib/site";
import HomeProductTile from "@/components/home/HomeProductTile";
import styles from "./page.module.css";

type SearchState = {
  status: "idle" | "loading" | "success" | "error";
  products: IProduct[];
  total: number;
  pages: number;
};

function searchHref(query: string, page = 1) {
  const params = new URLSearchParams({ q: query });
  if (page > 1) params.set("page", String(page));
  return `/recherche?${params}`;
}

function QueryForm({ query }: { query: string }) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = value.trim();
    router.push(nextQuery ? searchHref(nextQuery) : "/recherche");
  };
  return (
    <form role="search" aria-label="Recherche dans le catalogue" onSubmit={submit} className={styles.form}>
      <label htmlFor="results-query">Votre recherche</label>
      <div className={styles.field}>
        <Search aria-hidden="true" size={19} />
        <input id="results-query" name="q" type="search" value={value} onChange={event => setValue(event.target.value)} placeholder="Un nom de soin, une envie…" />
        <button type="submit">Rechercher<ArrowRight size={16} aria-hidden="true" /></button>
      </div>
    </form>
  );
}

function SearchContent({ query, page }: { query: string; page: number }) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<SearchState>({ status: query ? "loading" : "idle", products: [], total: 0, pages: 0 });

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    (async () => {
      try {
        const params = new URLSearchParams({ q: query, limit: "24", page: String(page) });
        const response = await fetch(`/api/products?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search request failed");
        const data = await response.json();
        if (!Array.isArray(data.products) || !data.pagination) throw new Error("Invalid search response");
        if (!controller.signal.aborted) setState({ status: "success", products: data.products, total: data.pagination.totalProducts, pages: data.pagination.totalPages });
      } catch {
        if (!controller.signal.aborted) setState({ status: "error", products: [], total: 0, pages: 0 });
      }
    })();
    return () => controller.abort();
  }, [query, page, attempt]);

  const loading = state.status === "loading";
  const empty = state.status === "success" && state.total === 0;
  const outsidePage = state.status === "success" && state.total > 0 && state.products.length === 0;
  const retry = () => {
    setState({ status: "loading", products: [], total: 0, pages: 0 });
    setAttempt(value => value + 1);
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav aria-label="Fil d’Ariane" className={styles.breadcrumb}><ol><li><Link href="/">Accueil</Link></li><li><ChevronRight size={12} aria-hidden="true" /><span aria-current="page">Recherche</span></li></ol></nav>
        <header className={styles.heading}>
          <p className={styles.eyebrow}><span aria-hidden="true" />Maison Yodi-K · La boutique</p>
          <h1>{query ? <>Résultats pour <em>« {query} »</em></> : <>Un soin <em>en tête ?</em></>}</h1>
          <p className={styles.intro}>{query ? "Retrouvez nos soins et prenez le temps de choisir votre prochain rituel." : "Un nom, un mot, une envie. Trouvez le soin que vous cherchez."}</p>
          <QueryForm query={query} />
        </header>

        <section aria-labelledby="search-results-title" aria-busy={loading} className={styles.results}>
          <div className={styles.toolbar}>
            <h2 id="search-results-title">{query ? "Les résultats" : "À vous de chercher"}</h2>
            <Link href="/categories" className={styles.allLink}>Tous nos univers<ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
          <p className={styles.status} role="status" aria-live="polite">
            {loading ? "Recherche en cours…" : state.status === "error" ? "La recherche n’a pas pu être chargée." : state.status === "success" ? <><strong>{state.total}</strong> produit{state.total !== 1 ? "s" : ""} trouvé{state.total !== 1 ? "s" : ""}{state.pages > 1 && ` · Page ${page} sur ${state.pages}`}</> : "Explorez le catalogue à partir d’un mot-clé."}
          </p>

          {loading && <ul className={styles.grid} aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <li key={index} className={styles.skeleton}><div /><span /><span /><span /></li>)}</ul>}

          {state.status === "success" && state.products.length > 0 && <ul className={styles.grid} aria-label="Produits trouvés">
            {state.products.map(product => <li key={String(product._id)}><HomeProductTile product={product} categoryTitle={categoryLabel(product.category)} /></li>)}
          </ul>}

          {(state.status === "idle" || empty) && <div className={styles.empty}>
            <span className={styles.stateIcon}>{empty ? <SearchX size={28} strokeWidth={1.3} aria-hidden="true" /> : <Search size={28} strokeWidth={1.3} aria-hidden="true" />}</span>
            <h3>{empty ? "Un autre mot, une nouvelle piste." : "Votre prochain rituel commence ici."}</h3>
            <p>{empty ? "Aucun produit ne correspond à cette recherche. Essayez un nom plus court ou un autre mot-clé." : "Essayez un type de soin ou le nom d’un produit pour découvrir les résultats."}</p>
            <div className={styles.suggestions} aria-label="Exemples de recherche">{["Huile", "Baume", "Barbe"].map(word => <Link key={word} href={searchHref(word.toLowerCase())}>{word}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}</div>
            {empty && <p className={styles.help}>Besoin d’un conseil ? <a href={`tel:${PHONE_COMMERCIAL.tel}`}>{PHONE_COMMERCIAL.label}</a></p>}
          </div>}

          {state.status === "error" && <div className={styles.empty}>
            <span className={styles.stateIcon}><RefreshCw size={28} strokeWidth={1.3} aria-hidden="true" /></span>
            <h3>Réessayons dans un instant.</h3>
            <p>Nous n’avons pas pu récupérer les produits. Vous pouvez relancer la recherche.</p>
            <button type="button" className={styles.primary} onClick={retry}><RefreshCw size={16} aria-hidden="true" />Réessayer</button>
          </div>}

          {outsidePage && <div className={styles.empty}><h3>Cette page n’affiche aucun produit.</h3><p>Retrouvez les résultats au début de votre recherche.</p><Link className={styles.primary} href={searchHref(query)}>Revenir aux résultats<ArrowRight size={16} aria-hidden="true" /></Link></div>}

          {state.status === "success" && state.products.length > 0 && state.pages > 1 && <nav aria-label="Pagination des résultats" className={styles.pagination}>
            {page > 1 && <Link href={searchHref(query, page - 1)}><ArrowLeft size={16} aria-hidden="true" />Précédent</Link>}
            <span>Page {page} sur {state.pages}</span>
            {page < state.pages && <Link href={searchHref(query, page + 1)}>Suivant<ArrowRight size={16} aria-hidden="true" /></Link>}
          </nav>}
        </section>
        <Link href="/categories" className={styles.back}><ArrowLeft size={16} aria-hidden="true" />Explorer tous les univers</Link>
      </div>
    </main>
  );
}

function SearchResults() {
  const params = useSearchParams();
  const query = (params.get("q") || "").trim();
  const page = Math.max(1, Math.min(10000, Number.parseInt(params.get("page") || "1", 10) || 1));
  return <SearchContent key={`${query}/${page}`} query={query} page={page} />;
}

export default function RecherchePage() {
  return <Suspense fallback={<main className={styles.page}><p className={styles.container} role="status">Préparation de votre recherche…</p></main>}><SearchResults /></Suspense>;
}
