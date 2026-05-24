import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Leaf,
  Sprout,
  Droplet,
  Wind,
  Scissors,
  Sparkles,
  Heart,
  Droplets,
  Baby,
  ArrowRight,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { SITE_URL, WHATSAPP } from "@/lib/site";

export const metadata: Metadata = {
  title: "Toutes nos catégories | Yodi-K",
  description:
    "Découvrez l'ensemble de nos catégories de cosmétiques naturels et de parapharmacie : tisanes, huiles, baumes, savons et plus.",
  alternates: { canonical: "/categories" },
};

interface Cat {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  href: string;
  image?: string; // si absent → carte à icône/dégradé
}

// Liens = slugs RÉELS existants (route dynamique). Les 6 premières ont une image.
const categories: Cat[] = [
  { id: "tisane-detox", name: "Tisane Détox", icon: Leaf, description: "Purifiez votre corps en douceur, 100% naturel", href: "/tisane/detox", image: "/categories/tisane-detox.webp" },
  { id: "tisane-digestive", name: "Tisane Digestive", icon: Sprout, description: "Pour une digestion saine et apaisée", href: "/tisane/digestive", image: "/categories/tisane-digestive.webp" },
  { id: "huile-barbe", name: "Huile à Barbe", icon: Droplet, description: "Hydrate et nourrit en profondeur", href: "/huile/huile-barbe", image: "/categories/huile-a-barbe.webp" },
  { id: "cheveux", name: "Huile Cheveux", icon: Wind, description: "Force, brillance et croissance naturelle", href: "/huile/cheveux", image: "/categories/cheveux.webp" },
  { id: "baume-barbe", name: "Baume à Barbe", icon: Scissors, description: "Soin premium pour une barbe disciplinée", href: "/baume/baume-barbe", image: "/categories/baume-a-barbe.webp" },
  { id: "savon", name: "Savon", icon: Sparkles, description: "Des savons doux pour une peau éclatante", href: "/savon", image: "/categories/savonnette.webp" },
  { id: "gomme-a-levres", name: "Gomme à lèvres", icon: Heart, description: "Pour des lèvres douces et hydratées", href: "/gomme-a-levres" },
  { id: "bain-corps", name: "Bain & Corps", icon: Droplets, description: "Détente et fraîcheur au quotidien", href: "/bain-corps" },
  { id: "bebe-maman", name: "Bébé & Maman", icon: Baby, description: "Soins doux pour eux", href: "/bebe-maman" },
];

const CategoriesPage = () => {
  return (
    <main className="pb-24">
      {/* En-tête */}
      <header className="text-center bg-gradient-to-b from-white to-[#FAF7F4] px-4 pt-10 md:pt-14 pb-8 md:pb-12">
        <nav aria-label="Fil d'Ariane" className="text-sm font-josefin text-gray-500 mb-4">
          <Link href="/" className="text-[#A36F5E] hover:underline">
            Accueil
          </Link>
          <span aria-hidden="true"> / </span>
          <span>Catégories</span>
        </nav>
        <h1 className="font-playfair text-3xl md:text-5xl font-bold text-[#A36F5E] leading-tight">
          Toutes nos catégories
        </h1>
        <p className="font-josefin text-sm md:text-base text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
          Explorez notre univers de cosmétiques naturels et de parapharmacie, au
          Sénégal 🇸🇳 et au Canada 🇨🇦.
        </p>
      </header>

      {/* Grille des catégories */}
      <section
        aria-label="Liste des catégories de produits"
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 lg:px-20 py-8 md:py-12"
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              aria-label={`Découvrir la catégorie ${cat.name}`}
              className="group relative block overflow-hidden rounded-2xl bg-black shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(163,111,94,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A36F5E] focus-visible:ring-offset-2 aspect-[16/10] sm:aspect-[4/3]"
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={`Catégorie ${cat.name} Yodi-K`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                // Pas d'image disponible → fond dégradé + grande icône
                <div className="absolute inset-0 bg-gradient-to-br from-[#A36F5E] to-[#8E5C4A] flex items-center justify-center">
                  <Icon className="w-16 h-16 text-white/85" strokeWidth={1.4} aria-hidden="true" />
                </div>
              )}

              {/* Badge catégorie */}
              <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-sm">
                <Icon className="w-4 h-4 text-[#A36F5E]" aria-hidden="true" />
                <h2 className="font-josefin text-sm font-semibold text-gray-900">
                  {cat.name}
                </h2>
              </div>

              {/* Voile bas + description + CTA */}
              <div className="absolute inset-0 z-[1] flex flex-col justify-end p-4 md:p-5 bg-gradient-to-t from-black/70 via-black/10 to-transparent">
                <p className="font-josefin text-sm text-white/90 overflow-hidden transition-all duration-300 max-h-16 opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-16 md:group-hover:opacity-100">
                  {cat.description}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 font-josefin text-sm font-semibold text-white transition-all duration-300 group-hover:gap-3">
                  Découvrir
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Aide */}
      <section className="bg-[#FAF7F4] border-t border-black/5 px-4 py-12 text-center">
        <p className="font-josefin text-lg text-gray-700 font-medium mb-6">
          Vous ne trouvez pas ce que vous cherchez&nbsp;?
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#A36F5E] hover:bg-[#916253] text-white font-josefin font-semibold px-7 py-3.5 transition-all duration-300 hover:-translate-y-0.5"
          >
            Retour à l&apos;accueil
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#A36F5E] text-[#A36F5E] hover:bg-[#A36F5E] hover:text-white font-josefin font-semibold px-7 py-3.5 transition-all duration-300 hover:-translate-y-0.5"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            Nous contacter
          </a>
        </div>
      </section>

      {/* SEO : données structurées */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Toutes nos catégories - Yodi-K",
            description: "Catégories de cosmétiques naturels et parapharmacie",
            url: `${SITE_URL}/categories`,
          }),
        }}
      />
    </main>
  );
};

export default CategoriesPage;
