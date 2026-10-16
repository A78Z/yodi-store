import { NextResponse } from "next/server";
import { getVisibleUnivers, toMenuCategories } from "@/lib/catalog";

// Catégories visibles pour les menus (desktop et mobile). Lecture seule.
export async function GET() {
  try {
    const categories = toMenuCategories(await getVisibleUnivers());
    return NextResponse.json({ categories }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return NextResponse.json({ message: "Erreur lors de la récupération des catégories" }, { status: 500 });
  }
}
