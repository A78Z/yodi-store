import { connectDB } from "@/lib/db";
import ProductModel, { type IProduct } from "@/lib/models/product";
import sharp from "sharp";

// Original images stay separate from fresh product data. next/image can resize
// them and cache them without keeping stale prices or stocks in a shared cache.
export function serializeProduct(product: Record<string, unknown>): IProduct {
  const result: Record<string, unknown> = { ...product, _id: String(product._id) };
  if (typeof result.imageUrl === "string" && /^data:image\/(?:png|jpeg|webp|avif|gif);base64,/.test(result.imageUrl)) {
    const version = product.updatedAt ? new Date(String(product.updatedAt)).getTime() : 0;
    result.imageUrl = `/api/product-images/${result._id}?v=${version}`;
  }
  return JSON.parse(JSON.stringify(result));
}

export async function getProduct(id: string): Promise<IProduct | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  await connectDB();
  const product = await ProductModel.findById(id).lean<Record<string, unknown>>();
  if (!product) return null;
  const result = serializeProduct(product);
  if (typeof product.imageUrl === "string" && /^data:image\/(?:png|jpeg|webp|avif|gif);base64,/.test(product.imageUrl)) {
    try {
      const metadata = await sharp(Buffer.from(product.imageUrl.split(",")[1], "base64")).metadata();
      result.imageWidth = metadata.width;
      result.imageHeight = metadata.height;
    } catch {
      // Preserve the existing fallback if an original image is malformed.
    }
  }
  return result;
}

export async function getCarouselProducts(): Promise<IProduct[]> {
  await connectDB();
  const products = await ProductModel.find({ stock: { $gt: 0 } })
    .select("-__v -usage -benefits").sort({ createdAt: -1 }).limit(12).lean<Record<string, unknown>[]>();
  return products.map(serializeProduct);
}
