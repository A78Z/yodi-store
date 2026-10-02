import Categories from "@/components/Categories";
import CurrentSelection from "@/components/CurrentSelection";
import LifestyleSection from "@/components/LifestyleSection";
import ProductCarousel from "@/components/ProductCarousel";
import Testimonials from "@/components/Testimonials";
import SencondFooter from "@/components/SencondFooter";
import Slider from "@/components/Slider";
import { getCarouselProducts } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch products server-side - passed to client carousel
  const carouselProducts = await getCarouselProducts().catch(error => {
    console.error("Error fetching carousel products:", error);
    return [];
  });

  return (
    <main>
      <Slider />
      <Categories />
      <CurrentSelection />
      <ProductCarousel initialProducts={carouselProducts} />
      <Testimonials />
      <LifestyleSection />
      <SencondFooter />
      {/* Bandeau supérieur vert */}
    </main>
  );
}
