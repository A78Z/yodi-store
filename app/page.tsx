import HomeHero from "@/components/home/HomeHero";
import HomeUnivers from "@/components/home/HomeUnivers";
import HomeProducts from "@/components/home/HomeProducts";
import HomeFooter from "@/components/home/HomeFooter";
import { getCarouselProducts } from "@/lib/product-data";
import { getVisibleUnivers } from "@/lib/catalog";

export const dynamic = "force-dynamic";

// Accueil — refonte direction A « Terre & Karité ».
// N'affiche que ce qui existe : univers non vides, produits réels.
export default async function Home() {
  const [products, univers] = await Promise.all([
    getCarouselProducts().catch((error) => {
      console.error("Error fetching home products:", error);
      return [];
    }),
    getVisibleUnivers().catch((error) => {
      console.error("Error fetching visible univers:", error);
      return [];
    }),
  ]);

  return (
    <>
      <main className="bg-ivoire">
        <HomeHero univers={univers.map(({ slug }) => ({ slug }))} />
        <HomeUnivers univers={univers} />
        <HomeProducts products={products} />
      </main>
      <HomeFooter univers={univers} />
    </>
  );
}
