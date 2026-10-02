import { createHash } from "node:crypto";
import { connectDB } from "@/lib/db";
import ProductModel from "@/lib/models/product";

export async function GET(req: Request, { params }: { params: Promise<{ productid: string }> }) {
  const { productid } = await params;
  if (!/^[a-f\d]{24}$/i.test(productid)) return new Response(null, { status: 404 });
  try {
    await connectDB();
    const product = await ProductModel.findById(productid).select("imageUrl updatedAt").lean<{ imageUrl: string; updatedAt?: Date }>();
    if (!product) return new Response(null, { status: 404 });
    const match = product?.imageUrl?.match(/^data:(image\/(?:png|jpeg|webp|avif|gif));base64,([\s\S]+)$/);
    if (!match) return new Response(null, { status: 404 });
    const bytes = Buffer.from(match[2], "base64");
    const etag = `"${createHash("sha256").update(bytes).digest("hex")}"`;
    const version = product.updatedAt ? new Date(product.updatedAt).getTime() : 0;
    const versionMatches = new URL(req.url).searchParams.get("v") === String(version);
    const headers = {
      "Content-Type": match[1], "X-Content-Type-Options": "nosniff", "ETag": etag,
      "Cache-Control": versionMatches ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate",
    };
    if (req.headers.get("if-none-match") === etag) return new Response(null, { status: 304, headers });
    return new Response(new Uint8Array(bytes), { headers });
  } catch {
    return new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
