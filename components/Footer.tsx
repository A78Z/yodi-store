"use client";

import { BoxIcon, Home, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  return pathname.includes("inscription") ||
    pathname.includes("profile") ||
    pathname.includes("connexion") ||
    pathname.includes("mot-de-passe-oublie") ||
    pathname.includes("reset-password") ? null : (
    <div
      className="bg-white z-30 sticky bottom-0 left-0 right-0 p-4 w-full flex items-center justify-around gap-4"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset",
      }}
    >
      <Link href="/" className="flex flex-col items-center gap-2">
        <Home className="w-5 h-5 text-black" />
        <span className="text-black">Accueil</span>
      </Link>
      <Link
        href="/categories"
        aria-label="Voir toutes nos catégories de produits"
        className="flex flex-col items-center gap-2"
      >
        <BoxIcon className="w-5 h-5 text-black" />
        <span className="text-black">Catégories</span>
      </Link>
      <Link href="/panier" className="flex flex-col items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-black" />
        <span className="text-black">Panier</span>
      </Link>
      <Link
        href={session?.user ? "/profile" : "/connexion"}
        className="flex flex-col items-center gap-2"
      >
        {session?.user ? (
          <>
            <Image
              src="/user.png"
              alt="Profile"
              width={20}
              height={20}
              className="w-7 h-7 object-cover rounded-full"
            />
            <span className="text-black">Profile</span>
          </>
        ) : (
          <>
            <User className="w-5 h-5 text-black" />
            <span className="text-black">Compte</span>
          </>
        )}
      </Link>
    </div>
  );
};

export default Footer;
