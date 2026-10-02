import { NextResponse } from "next/server";
import { getProduct } from "@/lib/product-data";

export async function GET(req: Request, { params }: { params: Promise<{ productid: string }> }) {
  try {
    const { productid } = await params;
    const product = await getProduct(productid);
    return NextResponse.json(product, { status: product ? 200 : 404, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Error fetching product", error);
    return NextResponse.json({ message: "Erreur lors de la récupération du produit" }, { status: 500 });
  }
}
