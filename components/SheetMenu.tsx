"use client";

import { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useMenuCategories } from "@/lib/use-menu-categories";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./CategoryNavigation.module.css";

export default function SheetMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { categories, loaded } = useMenuCategories();
  const pathname = usePathname();
  const close = () => { setOpen(false); setExpanded(null); };

  return (
    <Sheet open={open} onOpenChange={(value) => { setOpen(value); if (!value) setExpanded(null); }}>
      <SheetTrigger asChild>
        <button type="button" className={styles.mobileTrigger} aria-label="Ouvrir la boutique">
          <Menu size={24} aria-hidden="true" /><span>Boutique</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className={styles.mobile}>
        <div className={styles.mobileHeader}>
          <p className={styles.eyebrow}>Maison Yodi-K</p>
          <SheetTitle className={styles.mobileTitle}>Boutique</SheetTitle>
          <SheetDescription className={styles.mobileDescription}>Explorez nos soins naturels.</SheetDescription>
        </div>
        <SheetClose asChild><button type="button" className={styles.mobileClose} aria-label="Fermer la boutique"><X size={22} aria-hidden="true" /></button></SheetClose>
        <nav aria-label="Catégories de produits" className={styles.mobileNav}>
          {!loaded && <p role="status" className={styles.loading}>Chargement de la boutique…</p>}
          {loaded && !categories.length && <Link className={styles.all} href="/categories" onClick={close}>Voir la boutique <ArrowUpRight size={16} aria-hidden="true" /></Link>}
          <ul className={styles.mobileList}>
            {categories.map((category) => {
              const active = pathname === `/${category.slug}` || pathname.startsWith(`/${category.slug}/`);
              const isExpanded = expanded === category.id;
              const panelId = `mobile-category-${category.id}`;
              return (
                <li key={category.id} className={styles.mobileEntry}>
                  <div className={styles.mobileRow}>
                    <Link href={`/${category.slug}`} className={styles.mobileCategory} onClick={close}
                      aria-current={active ? (pathname === `/${category.slug}` ? "page" : "true") : undefined}>{category.title}</Link>
                    {!!category.subcategories?.length && <button type="button" className={styles.toggle}
                      aria-label={`Sous-catégories : ${category.title}`} aria-expanded={isExpanded} aria-controls={panelId}
                      onClick={() => setExpanded(isExpanded ? null : category.id)}>
                      <ChevronDown size={18} aria-hidden="true" className={isExpanded ? styles.rotated : undefined} />
                    </button>}
                  </div>
                  {!!category.subcategories?.length && <div id={panelId} hidden={!isExpanded} className={styles.mobileSubs}>
                    <Link href={`/${category.slug}`} className={styles.all} onClick={close}>Voir tous les produits <ArrowUpRight size={16} aria-hidden="true" /></Link>
                    <ul className={styles.mobileList}>{category.subcategories.map((sub) => {
                      const href = `/${category.slug}/${sub.slug}`;
                      return <li key={sub.id}><Link className={styles.card} href={href} onClick={close}
                        aria-current={pathname === href ? "page" : undefined}><span>{sub.title}</span><ArrowUpRight size={16} aria-hidden="true" /></Link></li>;
                    })}</ul>
                  </div>}
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
