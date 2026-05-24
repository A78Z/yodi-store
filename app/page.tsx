import Categories from "@/components/Categories";
import CurrentSelection from "@/components/CurrentSelection";
import LifestyleSection from "@/components/LifestyleSection";
import ProductCarousel from "@/components/ProductCarousel";
import Testimonials from "@/components/Testimonials";
import SencondFooter from "@/components/SencondFooter";
import Slider from "@/components/Slider";
import { connectDB } from "@/lib/db";
import ProductModel, { IProduct } from "@/lib/models/product";

// ============================================
// 🚀 SSR: Direct database query (more reliable than API fetch on Vercel)
// ============================================
async function getCarouselProducts(): Promise<IProduct[]> {
  try {
    // Connect to database
    await connectDB();

    // Direct query - bypasses API route issues on Vercel SSR
    const products = await ProductModel.find({ stock: { $gt: 0 } })
      .limit(12)
      .sort({ createdAt: -1 })
      .lean();

    // Serialize for client component (convert ObjectId to string)
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching carousel products:', error);
    return [];
  }
}

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

export default async function Home() {
  // Fetch products server-side - passed to client carousel
  const carouselProducts = await getCarouselProducts();

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
