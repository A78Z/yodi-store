import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getProduct } from "@/lib/product-data";
import { categoryLabel, subCategoryLabel } from "@/lib/catalog";
import { formatProductName } from "@/lib/format";
import { productHref } from "@/lib/pricing";

export const dynamic = "force-dynamic";
const loadProduct = cache(getProduct);
type Props = { params: Promise<{ productname: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productname } = await params;
  const product = await loadProduct(productname);
  if (!product) return { title: "Produit introuvable | Yodi-K" };
  return {
    title: `${formatProductName(product.title)} | Yodi-K`,
    description: product.description?.slice(0, 170),
    alternates: { canonical: productHref(product) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { productname } = await params;
  const product = await loadProduct(productname);
  if (!product) notFound();
  return <ProductDetail key={productname} initialProduct={product}
    categoryTitle={categoryLabel(product.category)}
    subcategoryTitle={product.subCategory ? subCategoryLabel(product.subCategory) : undefined} />;
}
