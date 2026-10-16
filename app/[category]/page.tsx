import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductPage } from "@/lib/product-query";
import { categoryLabel, getVisibleUnivers, isKnownCategory } from "@/lib/catalog";
import ProductCategory from "@/components/ProductCategory";
import CategoryComingSoon from "@/components/CategoryComingSoon";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ soin?: string; tri?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${categoryLabel(category)} | Yodi-K`,
    alternates: { canonical: `/${encodeURIComponent(category)}` },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const [{ category }, query] = await Promise.all([params, searchParams]);
  const univers = await getVisibleUnivers();
  const entry = univers.find((item) => item.slug === category);
  if (!entry) {
    if (!isKnownCategory(category)) notFound();
    return <CategoryComingSoon title={categoryLabel(category)} univers={univers} />;
  }

  const selectedSubcategory = entry.subcategories.find((sub) => sub.slug === query.soin)?.slug ?? null;
  const sort = ["newest", "price-asc", "price-desc"].includes(query.tri ?? "") ? query.tri! : "newest";
  const filters = new URLSearchParams({ category, limit: "8", sort });
  if (selectedSubcategory) filters.set("subCategory", selectedSubcategory);
  const initialData = await getProductPage(filters);

  return <ProductCategory key={`${category}/${selectedSubcategory}/${sort}`}
    category={category} title={entry.title} initialData={initialData}
    subcategories={entry.subcategories} selectedSubcategory={selectedSubcategory} sort={sort} />;
}
