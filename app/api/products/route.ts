import { NextResponse } from "next/server";
import { getProductPage } from "@/lib/product-query";

export async function GET(req: Request) {
  try {
    return NextResponse.json(await getProductPage(new URL(req.url).searchParams), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Error fetching products", error);
    return NextResponse.json({ message: "Erreur lors de la récupération des produits" }, { status: 500 });
  }
}
