import React from "react";
import { getProductPage } from "@/lib/product-query";

export const dynamic = "force-dynamic";
import ProductCategory from "@/components/ProductCategory";

const page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params;
  const initialData = await getProductPage(new URLSearchParams({ category, limit: "8" }));
  return (
    <ProductCategory key={category} category={category} initialData={initialData} />
  );
};

export default page;
