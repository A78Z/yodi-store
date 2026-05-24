"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// Bouton "Retour en haut" : apparaît après 400px de scroll, remonte en douceur.
// Positionné au-dessus de la bottom-nav (Footer) présente sur tous les écrans.
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setIsVisible(window.scrollY > 400);
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
      title="Retour en haut"
      className={`fixed bottom-24 right-4 md:right-6 z-[500] w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#A36F5E] hover:bg-[#916253] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#A36F5E] ${
        isVisible ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-3 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
};

export default ScrollToTopButton;
