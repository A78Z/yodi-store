// Catalogue public : catégories (« univers ») et sous-catégories affichées sur le site.
// Règle n°1 de la refonte : n'afficher que ce qui existe.
// La LISTE est calculée à partir des produits en base (aucune liste en dur) :
// une catégorie s'affiche si `visible = true` (collection `categories`, true par
// défaut) ET si elle contient au moins 1 produit actif (disponible !== false).
// Même règle pour les sous-catégories. Lecture seule : aucune écriture en base.
import { cache } from "react";
import { connectDB } from "@/lib/db";
import ProductModel from "@/lib/models/product";
import CategoryModel from "@/lib/models/category";
import { categories as LIBELLES } from "@/lib/sampledata";
import type { Category } from "@/lib/types/types";

export interface SousCategorieAffichee {
  slug: string;
  title: string;
  productCount: number;
}

export interface UniversAffiche {
  slug: string; // = champ `category` des produits (URL /[category])
  title: string;
  productCount: number;
  imageUrl: string; // photo du produit le plus récent de la catégorie
  subcategories: SousCategorieAffichee[];
}

// Libellés de sous-catégories absents de lib/sampledata.ts mais présents en base.
const SOUS_CATEGORIE_LIBELLES: Record<string, string> = {
  "huile-a-barbe": "Huile à barbe",
  "baume-barbe": "Baume à barbe",
};

const humanize = (slug: string) => {
  const text = slug.replace(/[-_]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export function categoryLabel(slug: string): string {
  return LIBELLES.find((c) => c.slug === slug)?.title ?? humanize(slug);
}

export function subCategoryLabel(slug: string): string {
  for (const c of LIBELLES) {
    const sub = c.subcategories?.find((s) => s.slug === slug);
    if (sub) return sub.title;
  }
  return SOUS_CATEGORIE_LIBELLES[slug] ?? humanize(slug);
}

// Catégorie ou sous-catégorie connue du site (même vide) : mérite une page
// « Bientôt disponible » plutôt qu'une 404.
export function isKnownCategory(slug: string): boolean {
  return LIBELLES.some((c) => c.slug === slug);
}

export function isKnownSubCategory(category: string, sub: string): boolean {
  return !!LIBELLES.find((c) => c.slug === category)?.subcategories?.some((s) => s.slug === sub);
}

interface GroupeStats {
  _id: { category: string; subCategory?: string | null };
  productCount: number;
  activeCount: number;
  productId: unknown;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl: string | null;
}

const ordre = (slug: string) => {
  const index = LIBELLES.findIndex((c) => c.slug === slug);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

// `cache` : une seule requête par rendu serveur, même si plusieurs composants l'appellent.
export const getVisibleUnivers = cache(async (): Promise<UniversAffiche[]> => {
  await connectDB();
  const [groupes, reglagesAdmin] = await Promise.all([
    ProductModel.aggregate<GroupeStats>([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { category: "$category", subCategory: "$subCategory" },
          productCount: { $sum: 1 },
          activeCount: { $sum: { $cond: [{ $eq: ["$disponible", false] }, 0, 1] } },
          productId: { $first: "$_id" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          // Les images en base64 sont servies par /api/product-images : on ne
          // remonte l'URL brute que pour les images déjà hébergées ailleurs.
          imageUrl: {
            $first: {
              $cond: [
                { $regexMatch: { input: { $ifNull: ["$imageUrl", ""] }, regex: /^data:image\// } },
                null,
                "$imageUrl",
              ],
            },
          },
        },
      },
    ]),
    // Compatibilité temporaire validée pour la Preview : réglage absent → visible.
    // Ne pas créer de collection ou de champ depuis le site public.
    CategoryModel.find({}, { slug: 1, title: 1, visible: 1 })
      .lean<{ slug: string; title?: string; visible?: boolean }[]>(),
  ]);

  const reglages = new Map(reglagesAdmin.map((c) => [c.slug, c]));
  const parCategorie = new Map<string, GroupeStats[]>();
  for (const g of groupes) {
    const slug = g._id.category;
    if (!slug) continue;
    parCategorie.set(slug, [...(parCategorie.get(slug) ?? []), g]);
  }

  const univers: UniversAffiche[] = [];
  for (const [slug, groupesCat] of parCategorie) {
    const reglage = reglages.get(slug);
    const actifs = groupesCat.reduce((n, g) => n + g.activeCount, 0);
    if (reglage?.visible === false || actifs < 1) continue;

    const recent = groupesCat.reduce((a, b) =>
      new Date(b.createdAt ?? 0) > new Date(a.createdAt ?? 0) ? b : a
    );
    const version = recent.updatedAt ? new Date(recent.updatedAt).getTime() : 0;

    univers.push({
      slug,
      title: reglage?.title || categoryLabel(slug),
      productCount: groupesCat.reduce((n, g) => n + g.productCount, 0),
      imageUrl: recent.imageUrl || `/api/product-images/${String(recent.productId)}?v=${version}`,
      subcategories: groupesCat
        .filter((g) => g._id.subCategory && g.activeCount > 0
          && reglages.get(`${slug}/${g._id.subCategory}`)?.visible !== false)
        .map((g) => ({
          slug: g._id.subCategory as string,
          title: subCategoryLabel(g._id.subCategory as string),
          productCount: g.productCount,
        }))
        .sort((a, b) => a.title.localeCompare(b.title, "fr")),
    });
  }

  return univers.sort((a, b) => ordre(a.slug) - ordre(b.slug) || a.title.localeCompare(b.title, "fr"));
});

// Format attendu par les menus (identique à lib/sampledata.ts → Category).
export function toMenuCategories(univers: UniversAffiche[]): Category[] {
  return univers.map((u) => ({
    id: u.slug,
    slug: u.slug,
    title: u.title,
    subcategories: u.subcategories.length > 0
      ? u.subcategories.map((s) => ({ id: `${u.slug}/${s.slug}`, slug: s.slug, title: s.title }))
      : undefined,
  }));
}
