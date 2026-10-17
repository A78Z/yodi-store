import "server-only";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import { publishedGalleryMedia } from "@/lib/manual-gallery";
export async function getManagedGallery() {
  if (process.env.VERCEL_ENV !== "preview" || process.env.VERCEL_GIT_COMMIT_REF !== "refonte" || !process.env.GALLERY_BLOB_HOST) return [];
  const host = process.env.GALLERY_BLOB_HOST;
  return unstable_cache(async () => {
    try {
      await connectDB();
      if (!mongoose.connection.db) return [];
      const entries = await mongoose.connection.db.collection("yodi_gallery_preview_refonte").find({ published: true }, { projection: { kind: 1, url: 1, thumbnail: 1, alt: 1, published: 1 } }).sort({ createdAt: -1 }).limit(24).toArray();
      return publishedGalleryMedia(entries, host);
    } catch { return []; }
  }, ["yodi-managed-gallery-refonte-v1", host], { revalidate: 60 })();
}
