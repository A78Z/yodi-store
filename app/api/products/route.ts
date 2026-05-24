import ProductModel from "@/lib/models/product";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

interface FilterType {
  category?: string;
  $or?: Array<{ subCategory: string | RegExp }>;
  isFeatured?: boolean;
  stock?: { $gt: number };
  title?: RegExp;
}

interface SortType {
  [key: string]: 1 | -1;
}

// Construit une regex insensible à la casse ET aux accents pour la recherche.
// Ex: "detox" matche "Tisane détox" ; "détox" matche "detox".
function accentInsensitiveRegex(q: string): RegExp {
  const classes: Record<string, string> = {
    a: "[aàâä]", e: "[eéèêë]", i: "[iîï]", o: "[oôö]", u: "[uùûü]", c: "[cç]",
  };
  const base = q
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // retire les accents de la requête
    .toLowerCase()
    .trim();
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // échappe les métacaractères
  const pattern = escaped.replace(/[aeiouc]/g, (ch) => classes[ch] || ch);
  return new RegExp(pattern, "i");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const subCategory = searchParams.get("subCategory");
  const q = searchParams.get("q"); // recherche texte (titre)
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "8");

  // Nouveaux paramètres pour le carrousel dynamique
  const featured = searchParams.get("featured"); // "true" pour produits mis en avant
  const inStock = searchParams.get("inStock"); // "true" pour stock > 0
  const sort = searchParams.get("sort") || "newest"; // newest, oldest, price-asc, price-desc

  try {
    // S'assurer que la connexion MongoDB est établie (sinon les requêtes
    // Mongoose bufferisent puis échouent sur une instance "froide").
    await connectDB();

    // Construction du filtre dynamique
    const filter: FilterType = {};

    if (category) {
      filter.category = category;
    }

    // Recherche texte sur le titre (insensible casse + accents)
    if (q && q.trim()) {
      filter.title = accentInsensitiveRegex(q);
    }

    if (subCategory) {
      filter.$or = [
        { subCategory: subCategory },
        { subCategory: new RegExp(subCategory, 'i') },
        { subCategory: new RegExp(subCategory.replace('-', ' '), 'i') },
        { subCategory: new RegExp(subCategory.replace(' ', '-'), 'i') }
      ];
    }

    // Filtre pour produits mis en avant (featured)
    if (featured === "true") {
      filter.isFeatured = true;
    }

    // Filtre pour produits en stock uniquement
    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    // Configuration du tri
    let sortConfig: SortType = { createdAt: -1 }; // Default: newest first

    switch (sort) {
      case "oldest":
        sortConfig = { createdAt: 1 };
        break;
      case "price-asc":
        sortConfig = { price: 1 };
        break;
      case "price-desc":
        sortConfig = { price: -1 };
        break;
      case "newest":
      default:
        sortConfig = { createdAt: -1 };
        break;
    }

    // Calcul de la pagination
    const skip = (page - 1) * limit;

    // Récupération des produits avec pagination et tri dynamique
    const products = await ProductModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortConfig);

    // Compter le total pour la pagination
    const total = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }, {
      status: 200,
      headers: {
        // Cache for 5 minutes on Vercel Edge, serve stale for 10 minutes while revalidating
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      }
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}

