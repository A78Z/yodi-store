"use client";

import React, { useState, useEffect, useRef } from "react";
import { Truck, CreditCard, Leaf, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { PHONE_COMMERCIAL } from "@/lib/site";
import SearchBar from "./SearchBar";

// Messages de la top bar (rotation toutes les 5s). Ton positif, mots-clés en gras.
const messages: { icon: React.ElementType; node: React.ReactNode }[] = [
  {
    icon: Truck,
    node: (
      <>
        Livraison <strong className="font-bold">sous 24h</strong> à Dakar{" "}
        <span className="opacity-80">(du lundi au samedi)</span>
      </>
    ),
  },
  {
    icon: CreditCard,
    node: (
      <>
        Paiement sécurisé <span className="opacity-80">— Wave · Orange Money · CB</span>
      </>
    ),
  },
  {
    icon: Leaf,
    node: (
      <>
        <strong className="font-bold">100% naturel</strong>, sans additifs
      </>
    ),
  },
  {
    icon: Phone,
    node: (
      <>
        Besoin d&apos;aide ?{" "}
        <a href={`tel:${PHONE_COMMERCIAL.tel}`} className="font-bold underline underline-offset-4 hover:text-white">
          {PHONE_COMMERCIAL.label}
        </a>
      </>
    ),
  },
];

const Header = () => {
  const pathname = usePathname();
  const [msgIndex, setMsgIndex] = useState(0);
  const paused = useRef(false);

  // Rotation des messages (pause au survol/focus)
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setMsgIndex((i) => (i + 1) % messages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  if (
    pathname.includes("inscription") ||
    pathname.includes("profile") ||
    pathname.includes("connexion") ||
    pathname.includes("mot-de-passe-oublie") ||
    pathname.includes("reset-password")
  ) {
    return null;
  }

  const ActiveIcon = messages[msgIndex].icon;

  return (
    <header className="w-full">
      {/* Bandeau de messages en rotation */}
      <div
        className="bg-[#A36F5E] text-white"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
      >
        <div className="max-w-7xl mx-auto min-h-9 md:min-h-14 py-1.5 px-3 md:px-6 flex items-center justify-center md:justify-between gap-4">
          {/* Message courant (centré sur mobile) */}
          <p
            aria-live="polite"
            className="flex items-center gap-2 text-[13px] md:text-sm font-medium tracking-[0.01em] text-center animate-in fade-in duration-500 md:shrink-0"
            key={msgIndex}
          >
            <ActiveIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{messages[msgIndex].node}</span>
          </p>

          {/* Barre de recherche — déplacée ici sur desktop (cachée sur mobile : reste sous le logo) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="w-full max-w-[600px]">
              <SearchBar id="search-topbar" />
            </div>
          </div>

          {/* Téléphone toujours visible sur desktop */}
          <a
            href={`tel:${PHONE_COMMERCIAL.tel}`}
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#FFE5D9] hover:text-white transition-colors shrink-0"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            {PHONE_COMMERCIAL.label}
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
