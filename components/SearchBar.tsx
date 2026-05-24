"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

// Placeholders dynamiques (rotation toutes les 3s)
const placeholders = [
  "Rechercher un produit…",
  "Essayez « huile de barbe »",
  "Essayez « tisane détox »",
  "Essayez « baume cheveux »",
];

// Barre de recherche réutilisable (design inchangé : pilule, ombre, bouton rond).
// `id` permet d'avoir plusieurs instances (desktop top bar + mobile) sans doublon d'id.
const SearchBar = ({ id = "site-search" }: { id?: string }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [phIndex, setPhIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setPhIndex((i) => (i + 1) % placeholders.length),
      3000
    );
    return () => clearInterval(id);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = query.trim();
    if (v) router.push(`/recherche?q=${encodeURIComponent(v)}`);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="group flex items-center w-full bg-white rounded-full border-2 border-transparent pl-5 pr-1.5 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 focus-within:border-[#A36F5E] focus-within:shadow-[0_4px_16px_rgba(163,111,94,0.15)]"
    >
      <label htmlFor={id} className="sr-only">
        Rechercher un produit
      </label>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholders[phIndex]}
        className="flex-1 min-w-0 bg-transparent outline-none text-[15px] text-gray-900 placeholder:text-gray-400"
      />
      <button
        type="submit"
        aria-label="Lancer la recherche"
        className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#A36F5E] hover:bg-[#916253] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Search className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </form>
  );
};

export default SearchBar;
