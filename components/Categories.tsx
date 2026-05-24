import { catImages } from "@/lib/sampledata";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  Sparkles,
  Sprout,
  Scissors,
  Wind,
  Droplet,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

// Métadonnées d'affichage par catégorie (clé = id de catImages).
// On NE touche PAS aux slugs/liens existants : on enrichit seulement l'UI.
const meta: Record<
  number,
  { icon: LucideIcon; description: string; alt: string; position?: string }
> = {
  1: {
    icon: Leaf,
    description: "Purifiez votre corps en douceur, 100% naturel",
    alt: "Femme tenant une boîte de tisane détox Yodi-K",
  },
  2: {
    icon: Sparkles,
    description: "Des savons doux pour une peau éclatante",
    alt: "Femme tenant un savon naturel et une huile Yodi-K",
  },
  3: {
    icon: Sprout,
    description: "Pour une digestion saine et apaisée",
    alt: "Femme tenant une boîte de tisane digestive Yodi-K",
  },
  4: {
    icon: Scissors,
    description: "Soin premium pour une barbe disciplinée",
    alt: "Homme barbu tenant un baume à barbe Yodi-K",
  },
  5: {
    icon: Wind,
    description: "Force, brillance et croissance naturelle",
    alt: "Chevelure mise en valeur avec un baume cheveux Yodi-K",
    position: "object-[center_30%]", // évite de couper le haut de la composition
  },
  6: {
    icon: Droplet,
    description: "Hydrate et nourrit en profondeur",
    alt: "Homme appliquant une huile à barbe Yodi-K",
  },
};

const Categories = () => {
  return (
    <section
      id="categories"
      className="w-full scroll-mt-24 bg-gradient-to-b from-white via-[#FAF7F4] to-white px-4 lg:px-20 py-12 md:py-20"
    >
      {/* En-tête de section */}
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#A36F5E] leading-tight">
          Yodi Cosmetics
        </h2>
        <p className="font-josefin text-lg md:text-2xl font-medium text-gray-700 mt-2">
          Parapharmacie en ligne <span className="font-playfair">&amp;</span>{" "}
          Cosmétiques
        </p>
        <p className="font-josefin text-sm md:text-base text-gray-500 mt-4 leading-relaxed">
          Découvrez notre sélection de produits 100% naturels, préparés avec
          soin pour votre beauté et votre bien-être au quotidien.
        </p>
      </div>

      {/* Grille des catégories */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {catImages.map((cat) => {
          const m = meta[cat.id];
          const Icon = m?.icon ?? Leaf;
          return (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              aria-label={`Découvrir la catégorie ${cat.title}`}
              className="group relative block overflow-hidden rounded-2xl bg-black shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(163,111,94,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A36F5E] focus-visible:ring-offset-2 aspect-[16/10] sm:aspect-[4/3]"
            >
              <Image
                src={cat.image}
                alt={m?.alt ?? cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${m?.position ?? "object-center"}`}
              />

              {/* Badge catégorie (toujours visible) */}
              <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-sm transition-all duration-300 group-hover:shadow-md">
                <Icon className="w-4 h-4 text-[#A36F5E]" aria-hidden="true" />
                <h3 className="font-josefin text-sm font-semibold text-gray-900">
                  {cat.title}
                </h3>
              </div>

              {/* Voile bas + description + CTA */}
              <div className="absolute inset-0 z-[1] flex flex-col justify-end p-4 md:p-5 bg-gradient-to-t from-black/70 via-black/10 to-transparent">
                <p className="font-josefin text-sm text-white/90 overflow-hidden transition-all duration-300 max-h-16 opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-16 md:group-hover:opacity-100">
                  {m?.description}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 font-josefin text-sm font-semibold text-white transition-all duration-300 group-hover:gap-3">
                  Découvrir
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
