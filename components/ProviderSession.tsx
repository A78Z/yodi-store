"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import useStore from "@/lib/store-manage";

export function ProviderSession({ children }: { children: React.ReactNode }) {
  // Réhydrate le panier/devise depuis localStorage APRÈS le montage,
  // pour que le 1er rendu client corresponde au rendu serveur (évite le
  // hydration mismatch). Le store est configuré avec skipHydration.
  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
