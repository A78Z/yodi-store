// Catalogue public : source unique des « univers » (catégories racine) affichés
// sur le site. Règle n°1 de la refonte : n'afficher que ce qui existe.
// Un univers est affiché si `visible = true` ET s'il contient au moins 1 produit
// actif (disponible !== false). Le drapeau `visible` sera géré plus tard depuis
// l'admin ; en attendant il vit ici. Lecture seule : aucune écriture en base.
import { connectDB } from "@/lib/db";
import ProductModel from "@/lib/models/product";

export interface Univers {
  slug: string; // = champ `category` des produits (URL /[category])
  title: string;
  visible: boolean;
}

export const UNIVERS: Univers[] = [
  { slug: "huile", title: "Huiles", visible: true },
  { slug: "baume", title: "Baumes", visible: true },
  { slug: "bain-corps", title: "Bain & Corps", visible: true },
  { slug: "tisane", title: "Tisanes", visible: true },
  { slug: "savon", title: "Savons", visible: true },
  { slug: "gomme-a-levres", title: "Gomme à lèvres", visible: true },
  { slug: "bebe-maman", title: "Bébé & Maman", visible: true },
];

export interface UniversAffiche extends Univers {
  productCount: number;
  imageUrl: string; // photo du produit le plus récent de l'univers
}

interface UniversStats {
  _id: string;
  productCount: number;
  activeCount: number;
  productId: unknown;
  updatedAt?: Date;
  imageUrl: string | null;
}

export async function getVisibleUnivers(): Promise<UniversAffiche[]> {
  await connectDB();
  const stats = await ProductModel.aggregate<UniversStats>([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$category",
        productCount: { $sum: 1 },
        activeCount: { $sum: { $cond: [{ $eq: ["$disponible", false] }, 0, 1] } },
        productId: { $first: "$_id" },
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
  ]);

  const bySlug = new Map(stats.map((s) => [s._id, s]));
  return UNIVERS.flatMap((univers) => {
    const s = bySlug.get(univers.slug);
    if (!univers.visible || !s || s.activeCount < 1) return [];
    const version = s.updatedAt ? new Date(s.updatedAt).getTime() : 0;
    return [{
      ...univers,
      productCount: s.productCount,
      imageUrl: s.imageUrl || `/api/product-images/${String(s.productId)}?v=${version}`,
    }];
  });
}
