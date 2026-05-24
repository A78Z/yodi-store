"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  CreditCard,
  Leaf,
  Pause,
  Play,
  ArrowRight,
} from "lucide-react";

// Slides du hero. Les images (banniere_*.png) sont remplacées par les nouvelles
// bannières propres (mêmes noms de fichiers) : 1=kit, 2=homme, 3=flacons, 4=femme.
// Ordre d'affichage : Femme → Homme → Produit → Coffret.
// `textPosition` = côté où le texte s'affiche (zone vide de l'image).
// `objectPos` = cadrage pour garder le sujet visible au recadrage mobile.
interface Slide {
  id: string;
  image: string;
  alt: string;
  objectPos: string;
  textPosition: "left" | "right";
  dark: boolean; // fond sombre → texte blanc sur desktop
  badge?: { text: string; promo?: boolean };
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  primary: { text: string; href: string };
  secondary?: { text: string; href: string };
}

const slides: Slide[] = [
  {
    id: "huile-locks-femme",
    image: "/slider/banniere_3.png", // femme (sujet à droite, zone vide à gauche)
    alt: "Femme africaine souriante avec de belles locs tenant l'huile Yodi-K",
    objectPos: "object-right",
    textPosition: "left", // zone vide à gauche
    dark: false,
    badge: { text: "Best-seller" },
    eyebrow: "⭐ Best-seller · Huile capillaire",
    title: "Huile Locks",
    subtitle: "Prenez soin de vos cheveux naturellement",
    description:
      "Formule naturelle pour nourrir, hydrater et sublimer vos locs et cheveux texturés.",
    bullets: ["100% naturelle", "Extraite à froid", "Sans additifs"],
    primary: { text: "Découvrir l'huile", href: "/huile/cheveux" },
    secondary: { text: "Voir toutes les huiles", href: "/huile" },
  },
  {
    id: "baume-barbe",
    image: "/slider/banniere_2.png",
    alt: "Homme africain élégant avec barbe soignée et produits Yodi-K",
    objectPos: "object-left",
    textPosition: "right", // zone vide à droite
    dark: true,
    eyebrow: "💪 Pour Lui · Soin barbe",
    title: "Baume à Barbe",
    subtitle: "Une barbe douce, dense et soignée",
    description:
      "Formule riche en huiles précieuses pour discipliner, hydrater et embellir votre barbe.",
    bullets: ["Hydratant", "Nourrissant", "Senteur boisée"],
    primary: { text: "Découvrir le baume", href: "/baume/baume-barbe" },
    secondary: { text: "Tous les soins homme", href: "/baume" },
  },
  {
    id: "huile-locks-produit",
    image: "/slider/banniere_4.png", // flacons (sujet à gauche, zone vide à droite)
    alt: "Bouteilles d'huile Locks Yodi-K en composition épurée",
    objectPos: "object-left",
    textPosition: "right",
    dark: false,
    badge: { text: "Best-seller" },
    eyebrow: "🌿 Best-seller · Huile capillaire",
    title: "Huile Locks Premium",
    subtitle: "L'essence naturelle pour vos cheveux",
    description:
      "Notre huile signature, formulée pour les locs, tresses et cheveux texturés.",
    bullets: ["Pour locs & tresses", "Effet brillance", "Stimule la pousse"],
    primary: { text: "Commander maintenant", href: "/huile/cheveux" },
    secondary: { text: "Voir les huiles", href: "/huile" },
  },
  {
    id: "coffret",
    image: "/slider/banniere_1.png",
    alt: "Coffret Yodi-K avec ruban doré et eucalyptus",
    objectPos: "object-left",
    textPosition: "right",
    dark: false,
    badge: { text: "Nouveau" },
    eyebrow: "🎁 Notre univers",
    title: "Coffret Yodi-K",
    subtitle: "Cosmétiques naturels, faits avec soin",
    description:
      "Découvrez nos huiles, baumes et soins naturels, préparés au Sénégal et au Canada.",
    bullets: ["100% naturel", "Sans additifs", "Livraison 24h Dakar"],
    primary: { text: "Découvrir nos produits", href: "/categories" },
    secondary: { text: "Voir les catégories", href: "/categories" },
  },
];

const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD = 50;

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const goToSlide = useCallback(
    (index: number) => setCurrentSlide((index + slides.length) % slides.length),
    []
  );
  const nextSlide = useCallback(
    () => setCurrentSlide((p) => (p + 1) % slides.length),
    []
  );
  const prevSlide = useCallback(
    () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    if (isPaused || reducedMotion) return;
    const interval = setInterval(nextSlide, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [isPaused, reducedMotion, nextSlide]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) prevSlide();
    else if (delta < -SWIPE_THRESHOLD) nextSlide();
    touchStartX.current = null;
  };

  const trustItems = [
    { icon: Truck, label: "Livraison 24h à Dakar" },
    { icon: CreditCard, label: "Wave · Orange Money · CB" },
    { icon: Leaf, label: "100% Naturel" },
  ];

  return (
    <section
      aria-label="Mises en avant Yodi-K"
      className="bg-gradient-to-b from-white to-[#FAF7F4] px-3 md:px-4 pt-4 md:pt-6 pb-6 md:pb-8"
    >
      <div
        className="group relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] aspect-[16/10] sm:aspect-[2/1] lg:aspect-[2.4/1]"
        role="region"
        aria-roledescription="carrousel"
        aria-label="Bannières promotionnelles"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const titleColor = slide.dark
            ? "text-white"
            : "text-white md:text-gray-900";
          const subColor = slide.dark
            ? "text-white/90"
            : "text-white/95 md:text-gray-700";
          const descColor = slide.dark
            ? "text-white/80"
            : "text-white/90 md:text-gray-600";
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="diapositive"
              aria-label={`${index + 1} sur ${slides.length} : ${slide.title}`}
              aria-hidden={!isActive}
              inert={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Image */}
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover ${slide.objectPos} ${
                  isActive && !reducedMotion ? "animate-ken-burns" : ""
                }`}
              />

              {/* Voile mobile (texte en bas) */}
              <div className="absolute inset-0 z-[1] md:hidden bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* Badge */}
              {slide.badge && (
                <span
                  className={`absolute top-3 left-3 md:top-5 md:left-5 z-[3] inline-flex items-center rounded-full px-3 py-1 text-[11px] md:text-xs font-bold uppercase tracking-wider text-white shadow-sm font-josefin ${
                    slide.badge.promo ? "bg-red-600" : "bg-[#A36F5E]"
                  }`}
                >
                  {slide.badge.text}
                </span>
              )}

              {/* Contenu texte */}
              <div className="absolute inset-0 z-[2] flex items-end md:items-center px-5 md:px-10 lg:px-16 pb-10 md:pb-0">
                <div
                  key={isActive ? `c-${currentSlide}` : undefined}
                  className={`w-full max-w-md mx-auto text-center md:mx-0 md:text-left ${
                    slide.textPosition === "right" ? "md:ml-auto" : "md:mr-auto"
                  } ${isActive && !reducedMotion ? "animate-in fade-in slide-in-from-bottom-2 duration-500" : ""}`}
                >
                  <span className="inline-block font-josefin text-[11px] md:text-sm font-semibold uppercase tracking-[0.12em] text-[#A36F5E] bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 mb-3 md:mb-4">
                    {slide.eyebrow}
                  </span>
                  <h2 className={`font-playfair font-bold leading-tight text-3xl md:text-4xl lg:text-5xl mb-2 ${titleColor}`}>
                    {slide.title}
                  </h2>
                  <p className={`font-josefin text-base md:text-lg mb-2 ${subColor}`}>
                    {slide.subtitle}
                  </p>
                  <p className={`hidden sm:block font-josefin text-sm mb-4 ${descColor}`}>
                    {slide.description}
                  </p>

                  {/* Bullets */}
                  <ul className="flex flex-wrap gap-2 justify-center md:justify-start mb-5">
                    {slide.bullets.map((b) => (
                      <li
                        key={b}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#A36F5E]/15 px-3 py-1 text-xs font-medium text-gray-800 font-josefin"
                      >
                        <span className="text-[#A36F5E] font-bold">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Link
                      href={slide.primary.href}
                      className="group/cta inline-flex items-center gap-2 bg-[#A36F5E] hover:bg-[#916253] text-white font-josefin font-semibold text-sm md:text-base px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(163,111,94,0.35)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {slide.primary.text}
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                    </Link>
                    {slide.secondary && (
                      <Link
                        href={slide.secondary.href}
                        className={`inline-flex items-center gap-1.5 font-josefin font-semibold text-sm md:text-base px-5 py-3 rounded-full border-2 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${
                          slide.dark
                            ? "bg-white/10 text-white border-white hover:bg-white hover:text-gray-900"
                            : "bg-white/85 text-[#A36F5E] border-[#A36F5E] hover:bg-[#A36F5E] hover:text-white"
                        }`}
                      >
                        {slide.secondary.text}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Dots */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30"
          role="tablist"
          aria-label="Choisir une diapositive"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Aller à la diapositive ${index + 1}`}
              aria-current={index === currentSlide}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Lecture/pause */}
        <button
          onClick={() => setIsPaused((p) => !p)}
          aria-label={isPaused ? "Lancer le défilement automatique" : "Mettre en pause le défilement automatique"}
          className="absolute bottom-3 right-4 z-30 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        {/* Flèches */}
        <button
          onClick={prevSlide}
          aria-label="Diapositive précédente"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-[#A36F5E] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 hover:scale-110 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A36F5E]"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Diapositive suivante"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-[#A36F5E] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-sm transition-all duration-300 hover:scale-110 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A36F5E]"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Barre de confiance */}
      <div className="mt-4 md:mt-6 w-full bg-white rounded-xl md:rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
        <ul className="flex items-center gap-6 md:justify-around justify-start overflow-x-auto px-4 md:px-6 py-3 md:py-4 font-josefin">
          {trustItems.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 shrink-0 text-sm text-gray-700 font-medium">
              <Icon className="w-5 h-5 text-[#A36F5E]" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Slider;
