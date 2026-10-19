"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useMenuCategories } from "@/lib/use-menu-categories";
import styles from "./CategoryNavigation.module.css";

export default function CategoryNavigation() {
  const { categories, loaded } = useMenuCategories();
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const close = () => { cancelClose(); setOpenId(null); };

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!nav.current?.contains(event.target as Node)) {
        if (timer.current) clearTimeout(timer.current);
        setOpenId(null);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openId) {
        event.preventDefault();
        if (timer.current) clearTimeout(timer.current);
        setOpenId(null);
        buttons.current.get(openId)?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [openId]);

  return (
    <nav ref={nav} aria-label="Catégories de produits" className={styles.desktop}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close();
      }}>
      <ul className={styles.bar} aria-busy={!loaded}>
        {!loaded && <li className={styles.loading}>Chargement de la boutique…</li>}
        {loaded && !categories.length && <li><Link className={styles.all} href="/categories">Voir la boutique <ArrowUpRight size={16} aria-hidden="true" /></Link></li>}
        {categories.map((category) => {
          const active = pathname === `/${category.slug}` || pathname.startsWith(`/${category.slug}/`);
          const expanded = openId === category.id;
          const panelId = `desktop-category-${category.id}`;
          return (
            <li key={category.id} className={styles.entry}
              onPointerEnter={(event) => {
                if (event.pointerType !== "mouse") return;
                cancelClose();
                // Do not hide a panel containing the keyboard focus.
                if (nav.current?.contains(document.activeElement)) return;
                timer.current = setTimeout(() => setOpenId(category.subcategories?.length ? category.id : null), 160);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType !== "mouse") return;
                cancelClose();
                const entry = event.currentTarget;
                timer.current = setTimeout(() => {
                  if (!entry.contains(document.activeElement)) setOpenId(null);
                }, 180);
              }}>
              <div className={styles.category} data-active={active || undefined}>
                <Link href={`/${category.slug}`} className={styles.categoryLink}
                  aria-current={active ? (pathname === `/${category.slug}` ? "page" : "true") : undefined}
                  onClick={close}>{category.title}</Link>
                {!!category.subcategories?.length && (
                  <button type="button" ref={(button) => {
                    if (button) buttons.current.set(category.id, button);
                    else buttons.current.delete(category.id);
                  }} className={styles.toggle} aria-label={`Sous-catégories : ${category.title}`}
                    aria-expanded={expanded} aria-controls={panelId}
                    onClick={() => { cancelClose(); setOpenId(expanded ? null : category.id); }}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") {
                        event.preventDefault(); cancelClose(); setOpenId(category.id);
                        requestAnimationFrame(() => document.getElementById(panelId)?.querySelector<HTMLAnchorElement>("a")?.focus());
                      }
                    }}>
                    <ChevronDown size={16} aria-hidden="true" className={expanded ? styles.rotated : undefined} />
                  </button>
                )}
              </div>
              {category.subcategories?.length ? (
                <section id={panelId} aria-label={category.title} hidden={!expanded} className={styles.panel} onPointerEnter={cancelClose}>
                  <div className={styles.panelHeading}>
                    <h2>{category.title}</h2>
                    <Link className={styles.all} href={`/${category.slug}`} onClick={close}>Voir tous les produits <ArrowUpRight size={16} aria-hidden="true" /></Link>
                  </div>
                  <ul className={styles.cards}>
                    {category.subcategories.map((sub) => {
                      const href = `/${category.slug}/${sub.slug}`;
                      return <li key={sub.id}><Link href={href} className={styles.card} onClick={close}
                        aria-current={pathname === href ? "page" : undefined}>
                        <span>{sub.title}</span><ArrowUpRight size={18} aria-hidden="true" />
                      </Link></li>;
                    })}
                  </ul>
                </section>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
