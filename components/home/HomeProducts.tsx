import type { IProduct } from "@/lib/models/product";
import HomeProductCard from "@/components/home/HomeProductCard";

const HomeProducts = ({ products }: { products: IProduct[] }) => {
  if (products.length === 0) return null;
  return (
    <section id="produits" aria-labelledby="produits-titre" className="mx-auto max-w-6xl scroll-mt-6 px-4 pt-12 md:px-8 md:pt-20">
      <h2 id="produits-titre" className="font-fraunces text-2xl text-cacao md:text-4xl">
        Nos produits
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {products.map((product, index) => (
          <li key={String(product._id)}>
            <HomeProductCard product={product} priority={index < 2} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomeProducts;
