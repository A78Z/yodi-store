"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, DollarSign, ChevronDown, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/sampledata";
import useStore from "@/lib/store-manage";
import SheetMenu from "./SheetMenu";
import SearchBar from "./SearchBar";
import { usePathname } from "next/navigation";

const Hero = () => {
  const pathname = usePathname();
  const {
    carts,
    totalQuantity,
    selectedCurrency,
    usdRate,
    setSelectedCurrency,
    setUsdRate,
  } = useStore();
  // usdRate est stocké dans le store pour être utilisé ailleurs dans l'application pour la conversion des prix
  const [isOpen, setIsOpen] = useState(false);
  const [isShowCart, setIsShowCart] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const cartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Menu catégories : ouverture immédiate, fermeture différée (anti "gap")
  const openMenu = (id: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    setSelectedId(id);
    setIsOpen(true);
  };

  // Délai de 300ms avant fermeture : laisse le temps de traverser vers le sous-menu
  const scheduleCloseMenu = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    menuTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setSelectedId(null);
    }, 300);
  };

  const closeMenuNow = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    setIsOpen(false);
    setSelectedId(null);
  };

  // Handlers pour le mini-panier avec délai de fermeture
  const handleCartMouseEnter = () => {
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
      cartTimeoutRef.current = null;
    }
    setIsShowCart(true);
  };

  const handleCartMouseLeave = () => {
    cartTimeoutRef.current = setTimeout(() => {
      setIsShowCart(false);
    }, 150); // Délai de 150ms pour permettre le passage de l'icône au popup
  };

  // Cleanup du timeout au démontage
  useEffect(() => {
    return () => {
      if (cartTimeoutRef.current) {
        clearTimeout(cartTimeoutRef.current);
      }
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  // console.log(usdRate);
  // console.log(selectedCurrency);

  // Récupérer le taux de change USD au chargement
  useEffect(() => {
    const fetchCurrencyRate = async () => {
      try {
        const response = await fetch("/api/currency", {
          cache: "force-cache",
          next: {
            revalidate: 60 * 60 * 1, // 1 heure
          },
        });
        const data = await response.json();
        // console.log("data", data);
        if (data && data.rate) {
          setUsdRate(data.rate);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du taux de change:",
          error
        );
      }
    };
    fetchCurrencyRate();
  }, [setUsdRate]);

  // Fermer le menu de devise en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".currency-selector")) {
        setIsCurrencyOpen(false);
      }
    };

    if (isCurrencyOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCurrencyOpen]);

  const subTotal = carts.reduce(
    (acc, cart) =>
      acc +
      (cart.price - (cart.discount ? (cart.price * cart.discount) / 100 : 0)) *
      cart.quantity,
    0
  );

  return pathname.includes("inscription") ||
    pathname.includes("profile") ||
    pathname.includes("connexion") ||
    pathname.includes("mot-de-passe-oublie") ||
    pathname.includes("reset-password") ? null : (
    <div className="flex flex-col items-center gap-4 md:gap-5 px-4 py-4 md:py-5 w-full max-w-7xl mx-auto">
      {/* Ligne 1 : logo (centre) + panier/devise (droite) */}
      <div className="w-full flex items-center justify-between">
        <SheetMenu />
        <div className="mb-0">
          <Link
            href="/"
            aria-label="Retour à l'accueil Yodi-K"
            className="relative group inline-block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A36F5E] focus-visible:ring-offset-2"
          >
            <Image
              src="/logo-yodi-k.png"
              alt="Yodi-K - Cosmétiques et parapharmacie naturels à Dakar"
              width={150}
              height={125}
              priority
              sizes="(max-width: 768px) 110px, 150px"
              className="w-[110px] md:w-[150px] h-auto object-contain drop-shadow-2xl transition-all duration-[250ms] ease-out group-hover:scale-[1.03] group-hover:opacity-85 group-active:scale-[0.98]"
            />
            {/* Glow effect autour du logo - gardé de la version améliorée */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 to-amber-300/20 rounded-full blur-xl -z-10 animate-pulse pointer-events-none"></div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Mini-cart container - relative pour positionner le dropdown */}
          <div
            className="relative z-[60]"
            onMouseEnter={handleCartMouseEnter}
            onMouseLeave={handleCartMouseLeave}
          >
            <Link
              href="/panier"
              className="relative flex items-center justify-center bg-[#A36F5E] cursor-pointer text-white rounded-full p-3 transition-all duration-300 hover:scale-110 hover:bg-[#916253]"
            >
              <ShoppingCart className="w-5 h-5 text-black" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Mini-Panier Dropdown */}
            {isShowCart && (
              <div
                className="absolute top-full right-0 mt-2 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-100 font-josefin"
              >
                {carts.length < 1 ? (
                  <div className="flex flex-col items-center justify-center p-6">
                    <ShoppingCart className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Votre panier est vide</p>
                  </div>
                ) : (
                  <div className="p-4">
                    {/* Liste des produits */}
                    <div className="max-h-64 overflow-y-auto space-y-3">
                      {carts.map((cart) => (
                        <div
                          key={cart.id}
                          className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
                        >
                          <Image
                            src={cart.imageUrl}
                            alt={cart.title}
                            width={60}
                            height={60}
                            className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                              {cart.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-[#A36F5E] font-semibold">
                                {cart.quantity} ×{" "}
                                {selectedCurrency === "XOF"
                                  ? Math.round(cart.price - (cart.discount ? (cart.price * cart.discount) / 100 : 0))
                                  : Number((cart.price - (cart.discount ? (cart.price * cart.discount) / 100 : 0)) / Number(usdRate || 1)).toFixed(2)}
                                {selectedCurrency === "XOF" ? " FCFA" : " USD"}
                              </span>
                              {cart.discount && cart.discount > 0 && (
                                <span className="text-xs text-gray-400 line-through">
                                  {selectedCurrency === "XOF"
                                    ? cart.price
                                    : Number(cart.price / Number(usdRate || 1)).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sous-total */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-600">Sous-total</span>
                      <span className="text-base font-bold text-[#A36F5E]">
                        {selectedCurrency === "XOF"
                          ? Math.round(subTotal).toLocaleString("fr-FR")
                          : Number(subTotal / Number(usdRate || 1)).toFixed(2)}{" "}
                        {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                      </span>
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-2 mt-4">
                      <Link
                        href="/panier"
                        className="flex-1 py-2.5 text-center text-sm font-semibold text-[#A36F5E] border border-[#A36F5E] rounded-full hover:bg-[#A36F5E] hover:text-white transition-colors duration-300"
                      >
                        Voir le panier
                      </Link>
                      <Link
                        href="/checkout"
                        className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-[#A36F5E] rounded-full hover:bg-[#916253] transition-colors duration-300"
                      >
                        Commander
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sélecteur de devise moderne */}
          <div className="relative currency-selector">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="group relative flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 cursor-pointer text-gray-700 rounded-full px-3 py-2.5 transition-all duration-300 hover:bg-white hover:border-[#A36F5E] hover:shadow-md text-sm font-medium"
            >
              <Globe className="w-4 h-4 text-[#A36F5E] transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-semibold">{selectedCurrency}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isCurrencyOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl z-50 min-w-[160px] border border-gray-200/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    setSelectedCurrency("XOF");
                    setIsCurrencyOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${selectedCurrency === "XOF"
                    ? "bg-[#A36F5E] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full ${selectedCurrency === "XOF"
                      ? "bg-white/20"
                      : "bg-[#A36F5E]/10"
                      }`}
                  >
                    <span className="text-xs font-bold">F</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">XOF</span>
                    <span
                      className={`text-xs ${selectedCurrency === "XOF" ? "text-white/80" : "text-gray-500"}`}
                    >
                      FCFA
                    </span>
                  </div>
                  {selectedCurrency === "XOF" && (
                    <div className="ml-auto">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>

                <div className="h-px bg-gray-200"></div>

                <button
                  onClick={() => {
                    setSelectedCurrency("USD");
                    setIsCurrencyOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${selectedCurrency === "USD"
                    ? "bg-[#A36F5E] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full ${selectedCurrency === "USD"
                      ? "bg-white/20"
                      : "bg-[#A36F5E]/10"
                      }`}
                  >
                    <DollarSign
                      className={`w-4 h-4 ${selectedCurrency === "USD" ? "text-white" : "text-[#A36F5E]"}`}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">USD</span>
                    <span
                      className={`text-xs ${selectedCurrency === "USD" ? "text-white/80" : "text-gray-500"}`}
                    >
                      Dollar
                    </span>
                  </div>
                  {selectedCurrency === "USD" && (
                    <div className="ml-auto">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Ligne 2 : barre de recherche — mobile uniquement (sur desktop elle est dans la top bar) */}
      <div className="w-full flex justify-center md:hidden">
        <div className="w-full max-w-[600px]">
          <SearchBar id="search-mobile" />
        </div>
      </div>

      {/* Ligne 3 : Premium Category Menu */}
      <nav
        aria-label="Catégories de produits"
        className="md:flex hidden items-center justify-center relative z-50"
        onKeyDown={(e) => {
          if (e.key === "Escape") closeMenuNow();
        }}
      >
        <div className="flex items-center gap-0 bg-white/50 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm border border-gray-100/50">
          {categories.map((category) => {
            const isOpenHere = isOpen && selectedId === category.id;
            return (
              <div
                key={category.id}
                onMouseEnter={() => openMenu(category.id)}
                onMouseLeave={scheduleCloseMenu}
                onFocus={() => openMenu(category.id)}
                onBlur={scheduleCloseMenu}
                className="relative group"
              >
                <Link
                  href={`/${category.slug}`}
                  aria-haspopup={category.subcategories ? "true" : undefined}
                  aria-expanded={category.subcategories ? isOpenHere : undefined}
                  className={`
                  relative block px-4 py-3 text-sm font-medium tracking-wide rounded-full
                  transition-all duration-[250ms] ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A36F5E] focus-visible:ring-offset-1
                  ${selectedId === category.id
                      ? 'text-white bg-[#A36F5E] scale-[1.02]'
                      : 'text-gray-700 hover:text-[#A36F5E] hover:scale-[1.02]'
                    }
                `}
                >
                  <span className="relative z-10">{category.title}</span>

                  {/* Elegant underline animation */}
                  {selectedId !== category.id && (
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#A36F5E] transition-all duration-300 ease-out group-hover:w-[calc(100%-24px)] opacity-0 group-hover:opacity-100"></span>
                  )}
                </Link>

                {/* Premium Subcategory Dropdown
                    -> PAS de margin-top : on colle le dropdown au parent et on crée
                       l'espace visuel via padding-top (pt-3). Ce padding agit comme
                       "pont invisible" : le hover ne se rompt pas en traversant le gap. */}
                {isOpenHere && category.subcategories && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Triangle centré sous le bouton actif */}
                    <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-100"></div>

                    <ul
                      role="menu"
                      aria-label={category.title}
                      className="relative bg-white rounded-xl border border-gray-100/80 overflow-hidden min-w-[220px] py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                    >
                      {/* Subtle gradient header */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A36F5E]/20 via-[#A36F5E]/40 to-[#A36F5E]/20"></div>

                      {category.subcategories?.map((subcategory, subIndex) => (
                        <li role="none" key={`${subcategory.id}-${subIndex}`}>
                          <Link
                            href={`/${category.slug}/${subcategory.slug}`}
                            role="menuitem"
                            className="group/item relative flex items-center gap-3 px-5 py-3 text-sm text-gray-700 cursor-pointer transition-all duration-200 ease-out hover:bg-[#FFF5F0] hover:text-[#A36F5E] hover:translate-x-1 focus-visible:outline-none focus-visible:bg-[#FFF5F0] focus-visible:text-[#A36F5E]"
                          >
                            {/* Hover indicator bar */}
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-[60%] bg-[#A36F5E] rounded-r-full transition-all duration-200 group-hover/item:w-[3px]"></span>

                            {/* Puce couleur marque */}
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A36F5E]/40 transition-all duration-200 group-hover/item:bg-[#A36F5E] group-hover/item:scale-125"></span>

                            <span className="font-medium tracking-wide">{subcategory.title}</span>

                            {/* Arrow on hover */}
                            <svg
                              className="w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0 text-[#A36F5E]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Hero;
