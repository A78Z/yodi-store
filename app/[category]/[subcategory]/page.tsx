import React from "react";
import { notFound } from "next/navigation";
import { getProductPage } from "@/lib/product-query";
import { getVisibleUnivers, isKnownSubCategory, subCategoryLabel } from "@/lib/catalog";

export const dynamic = "force-dynamic";
import ProductSubcategory from "@/components/ProductSubcategory";
import CategoryComingSoon from "@/components/CategoryComingSoon";

const page = async ({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) => {
  const { category, subcategory } = await params;

  const [initialData, univers] = await Promise.all([
    getProductPage(new URLSearchParams({ category, subCategory: subcategory, limit: "8" })),
    getVisibleUnivers().catch((error) => {
      console.error("Error fetching visible categories:", error);
      return null; // en cas d'erreur : comportement d'origine
    }),
  ]);

  // Les anciennes URL qui ont des produits (ex. /huile/cheveux) restent servies.
  const total = initialData.pagination.totalProducts;
  const categoryVisible = univers?.some((u) => u.slug === category);
  if (univers && (!categoryVisible || total === 0)) {
    if (!isKnownSubCategory(category, subcategory) && total === 0) notFound();
    return <CategoryComingSoon title={subCategoryLabel(subcategory)} univers={univers} />;
  }

  return <ProductSubcategory category={category} subcategory={subcategory} key={`${category}/${subcategory}`} initialData={initialData} />;
};

export default page;
