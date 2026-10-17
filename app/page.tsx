import HomeHero from "@/components/home/HomeHero";
import HomeUnivers from "@/components/home/HomeUnivers";
import HomeProducts from "@/components/home/HomeProducts";
import HomeFooter from "@/components/home/HomeFooter";
import { getCarouselProducts } from "@/lib/product-data";
import { getVisibleUnivers } from "@/lib/catalog";
import { getManagedGallery } from "@/lib/manual-gallery-data";
import { productHref } from "@/lib/pricing";
import type { HomeGalleryMedia } from "@/components/home/HomeMediaGallery";

export const dynamic = "force-dynamic";

// Accueil — refonte direction A « Terre & Karité ».
// N'affiche que ce qui existe : univers non vides, produits réels.
export default async function Home() {
  const [products, univers, managedGallery] = await Promise.all([
    getCarouselProducts().catch((error) => {
      console.error("Error fetching home products:", error);
      return [];
    }),
    getVisibleUnivers().catch((error) => {
      console.error("Error fetching visible univers:", error);
      return [];
    }),
    getManagedGallery(),
  ]);

  // Temporary catalogue gallery, explicitly independent from Facebook. Preview refonte only.
  // Reuses existing product photos without adding documents or changing the catalogue.
  const seenPhotos = new Set<string>();
  const galleryMedia: HomeGalleryMedia[] = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_GIT_COMMIT_REF === "refonte"
    ? products.flatMap(product => {
      const photo = product.imageUrl;
      if (!photo || photo === "/logo-yodi-k.png" || seenPhotos.has(photo)) return [];
      seenPhotos.add(photo);
      return [{ id: String(product._id), kind: "photo" as const, thumbnail: photo,
        permalink: productHref(product), internal: true, label: `Découvrir ${product.title}` }];
    }) : [];

  return (
    <>
      <main className="bg-ivoire">
        <HomeHero univers={univers.map(({ slug }) => ({ slug }))} />
        <HomeUnivers univers={univers} />
        <HomeProducts products={products} />
      </main>
      <HomeFooter univers={univers} facebookMedia={managedGallery.length ? managedGallery : galleryMedia} galleryLabel="La galerie des soins Yodi-K" />
    </>
  );
}
