import HomeHero from "@/components/home/HomeHero";
import HomeUnivers from "@/components/home/HomeUnivers";
import HomeProducts from "@/components/home/HomeProducts";
import HomeFooter from "@/components/home/HomeFooter";
import { getCarouselProducts } from "@/lib/product-data";
import { getVisibleUnivers } from "@/lib/catalog";
import { getManagedGallery } from "@/lib/manual-gallery-data";
import { completeHomeGallery } from "@/lib/home-gallery";

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

  const galleryMedia = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_GIT_COMMIT_REF === "refonte"
    ? completeHomeGallery(managedGallery) : [];

  return (
    <>
      <main className="bg-ivoire">
        <HomeHero univers={univers.map(({ slug }) => ({ slug }))} />
        <HomeUnivers univers={univers} />
        <HomeProducts products={products} />
      </main>
      <HomeFooter univers={univers} facebookMedia={galleryMedia} galleryLabel="La galerie des soins Yodi-K" />
    </>
  );
}
