"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/types/types";

// Catégories visibles pour les menus, chargées une seule fois par visite
// (partagées entre le menu desktop et le menu mobile).
let pending: Promise<Category[]> | null = null;

function loadMenuCategories(): Promise<Category[]> {
  pending ??= fetch("/api/categories")
    .then((response) => {
      if (!response.ok) throw new Error("Categories request failed");
      return response.json();
    })
    .then((data) => (Array.isArray(data.categories) ? data.categories : []))
    .catch((error) => {
      console.error("Erreur lors du chargement des catégories:", error);
      pending = null; // nouvel essai au prochain affichage
      return [];
    });
  return pending;
}

export function useMenuCategories(): { categories: Category[]; loaded: boolean } {
  const [state, setState] = useState<{ categories: Category[]; loaded: boolean }>({ categories: [], loaded: false });
  useEffect(() => {
    let active = true;
    loadMenuCategories().then((categories) => {
      if (active) setState({ categories, loaded: true });
    });
    return () => {
      active = false;
    };
  }, []);
  return state;
}
