import React from "react";
import { getProductPage } from "@/lib/product-query";

export const dynamic = "force-dynamic";
import ProductSubcategory from "@/components/ProductSubcategory";

const page = async ({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) => {
  const { category, subcategory } = await params;

  const initialData = await getProductPage(new URLSearchParams({ category, subCategory: subcategory, limit: "8" }));
  return <ProductSubcategory category={category} subcategory={subcategory} key={`${category}/${subcategory}`} initialData={initialData} />;
};

export default page;
