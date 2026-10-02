import ProductModel from "@/lib/models/product";
import { serializeProduct } from "@/lib/product-data";
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

export async function getProductPage(searchParams: URLSearchParams) {
  const category = searchParams.get("category");
  const subCategory = searchParams.get("subCategory");
  const q = searchParams.get("q"); // recherche texte (titre)
  const page = Math.max(1, Math.min(10000, Number.parseInt(searchParams.get("page") || "1", 10) || 1));
  const limit = Math.max(1, Math.min(100, Number.parseInt(searchParams.get("limit") || "8", 10) || 8));

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
    const [rows, total] = await Promise.all([
      ProductModel.find(filter).select("-__v -usage -benefits")
        .skip(skip).limit(limit).sort(sortConfig).lean<Record<string, unknown>[]>(),
      ProductModel.countDocuments(filter),
    ]);
    const products = rows.map(serializeProduct);
    const totalPages = Math.ceil(total / limit);

    return {
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    throw error;
  }
}
