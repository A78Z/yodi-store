import React from "react";
import { Star, Sparkles } from "lucide-react";

// ⚠️ ÉCHANTILLONS À VALIDER / REMPLACER PAR DE VRAIS AVIS avant toute mise en
// avant durable. Aucune note globale ni badge "Achat vérifié" n'est affiché tant
// que ce n'est pas vérifiable (choix : version honnête). Pour brancher de vrais
// avis : remplacer ce tableau (ou, à terme, le servir depuis l'admin — cf. SPEC-ADMIN-AVIS.md).
const testimonials = [
  {
    id: 1,
    text: "J'utilise la Tisane Détox depuis 2 mois et je me sens beaucoup plus légère. Ma peau est aussi plus éclatante. Yodi-K c'est devenu ma routine bien-être !",
    author: "Aïssatou D.",
    city: "Dakar, Plateau",
    rating: 5,
  },
  {
    id: 2,
    text: "Les huiles cheveux sont incroyables, j'ai vu une vraie différence après 3 semaines. En plus tout est naturel, c'est ce que je cherchais depuis longtemps.",
    author: "Mariama S.",
    city: "Thiès",
    rating: 5,
  },
  {
    id: 3,
    text: "Livraison super rapide à Dakar, en quelques heures j'avais ma commande. Les produits sont authentiques et bien emballés. Service au top !",
    author: "Ousmane F.",
    city: "Dakar, Sacré-Cœur",
    rating: 5,
  },
];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5 mb-4" aria-label={`Note ${rating} sur 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        aria-hidden="true"
      />
    ))}
  </div>
);

const Testimonials = () => {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="w-full bg-gradient-to-b from-white via-[#FAF7F4] to-white px-4 lg:px-20 py-12 md:py-20"
    >
      {/* En-tête */}
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
        <span className="inline-flex items-center gap-2 rounded-full bg-white border border-[#A36F5E]/20 shadow-sm px-4 py-2 mb-5 font-josefin text-sm font-medium text-gray-600">
          <Sparkles className="w-4 h-4 text-[#A36F5E]" aria-hidden="true" />
          Une communauté grandissante de clients fidèles au Sénégal
        </span>
        <h2
          id="testimonials-title"
          className="font-playfair text-3xl md:text-4xl font-bold text-[#A36F5E] leading-tight"
        >
          Ils nous font confiance
        </h2>
        <p className="font-josefin text-sm md:text-base text-gray-500 mt-4 leading-relaxed">
          Découvrez ce que disent nos clientes et clients qui utilisent nos
          produits au quotidien.
        </p>
      </div>

      {/* Cartes témoignages */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((t) => (
          <article
            key={t.id}
            aria-label={`Témoignage de ${t.author}`}
            className="relative flex flex-col rounded-2xl bg-white border border-black/5 p-7 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(163,111,94,0.15)]"
          >
            {/* Guillemet décoratif */}
            <span
              aria-hidden="true"
              className="absolute top-3 right-5 font-playfair text-6xl leading-none text-[#A36F5E]/15 select-none"
            >
              &rdquo;
            </span>

            <StarRating rating={t.rating} />

            <p className="font-josefin text-[15px] text-gray-700 leading-relaxed italic flex-grow">
              {t.text}
            </p>

            {/* Auteur */}
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-black/5">
              <div
                aria-hidden="true"
                className="w-11 h-11 rounded-full bg-gradient-to-br from-[#A36F5E] to-[#8E5C4A] text-white flex items-center justify-center font-josefin font-semibold shrink-0"
              >
                {getInitials(t.author)}
              </div>
              <div className="min-w-0">
                <p className="font-josefin font-semibold text-gray-900 text-sm">
                  {t.author}
                </p>
                <p className="font-josefin text-xs text-gray-500">{t.city}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
