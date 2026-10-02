import ProductDetail from "@/components/ProductDetail";
import { getProduct } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ productname: string }> }) {
  const { productname } = await params;
  return <ProductDetail key={productname} initialProduct={await getProduct(productname)} />;
}
