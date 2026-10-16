import React from "react";
import { notFound } from "next/navigation";
import { getProductPage } from "@/lib/product-query";
import { categoryLabel, getVisibleUnivers, isKnownCategory } from "@/lib/catalog";

export const dynamic = "force-dynamic";
import ProductCategory from "@/components/ProductCategory";
import CategoryComingSoon from "@/components/CategoryComingSoon";

const page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params;
  const [initialData, univers] = await Promise.all([
    getProductPage(new URLSearchParams({ category, limit: "8" })),
    getVisibleUnivers().catch((error) => {
      console.error("Error fetching visible categories:", error);
      return null; // en cas d'erreur : comportement d'origine
    }),
  ]);

  const entry = univers?.find((u) => u.slug === category);
  if (univers && !entry) {
    // Catégorie masquée ou sans produit actif : page propre, jamais vide.
    if (!isKnownCategory(category) && initialData.pagination.totalProducts === 0) notFound();
    return <CategoryComingSoon title={categoryLabel(category)} univers={univers} />;
  }

  return (
    <ProductCategory
      key={category}
      category={category}
      initialData={initialData}
      visibleSubcategories={entry?.subcategories}
    />
  );
};

export default page;
