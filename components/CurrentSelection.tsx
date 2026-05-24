"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { currentSelection } from "@/lib/sampledata";
import { Star, Sprout, Flame, ArrowRight, type LucideIcon } from "lucide-react";

// Badges d'affichage par sélection (clé = id). Optionnels, à valider avec le propriétaire.
const meta: Record<string, { icon: LucideIcon; label: string; color: string }> = {
  hsy51: { icon: Star, label: "Best-seller", color: "text-amber-600" },
  atw92: { icon: Sprout, label: "Nouveauté", color: "text-emerald-600" },
  xqy73: { icon: Flame, label: "Coup de cœur", color: "text-red-600" },
};

const CurrentSelection = () => {
  return (
    <section className="w-full bg-white px-4 lg:px-20 py-12 md:py-20">
      {/* En-tête */}
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#A36F5E] leading-tight">
          Découvrez notre sélection du moment
        </h2>
        <p className="font-josefin text-sm md:text-base text-gray-500 mt-4 leading-relaxed">
          Les produits phares choisis pour vous, préparés avec soin pour votre
          bien-être au quotidien.
        </p>
      </div>

      {/* Grille des 3 sélections */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {currentSelection.map((product) => {
          const m = meta[product.id];
          const Icon = m?.icon;
          return (
            <Link
              key={product.id}
              href={`/${product.category}`}
              aria-label={`Voir les produits : ${product.title}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(163,111,94,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A36F5E] focus-visible:ring-offset-2"
            >
              {/* Zone image (aucun texte par-dessus) */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#FAF7F4]">
                {m && Icon && (
                  <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-sm font-josefin text-xs font-semibold">
                    <Icon className={`w-3.5 h-3.5 ${m.color}`} aria-hidden="true" />
                    <span className={m.color}>{m.label}</span>
                  </span>
                )}
                <Image
                  src={product.productImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Zone contenu (fond blanc) */}
              <div className="flex flex-col flex-grow p-5">
                <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="font-josefin text-sm text-gray-500 leading-relaxed flex-grow">
                  {product.description}
                </p>
                {/* CTA uniforme pour les 3 cartes */}
                <span className="mt-5 inline-flex items-center justify-center gap-2 self-stretch sm:self-start rounded-full bg-[#A36F5E] group-hover:bg-[#916253] text-white font-josefin font-semibold text-sm px-6 py-3 transition-all duration-300 group-hover:-translate-y-0.5">
                  Voir les produits
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

      {/* CTA global */}
      <div className="flex justify-center mt-10 md:mt-12">
        <Link
          href="/tisane"
          className="group inline-flex items-center gap-2 rounded-full border-2 border-[#A36F5E] text-[#A36F5E] hover:bg-[#A36F5E] hover:text-white font-josefin font-semibold px-8 py-3.5 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A36F5E] focus-visible:ring-offset-2"
        >
          Voir toute la sélection
          <ArrowRight
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
};

export default CurrentSelection;
