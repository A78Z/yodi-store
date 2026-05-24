"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Bell } from "lucide-react";

// Chargement LAZY de la modale : le code n'est téléchargé qu'au 1er clic.
const NotifyModal = dynamic(() => import("@/components/NotifyModal"), {
  ssr: false,
});

interface NotifyButtonProps {
  productId: string;
  productName: string;
  productImage?: string;
  variant?: "card" | "detail";
  className?: string;
}

const NotifyButton = ({
  productId,
  productName,
  productImage,
  variant = "card",
  className = "",
}: NotifyButtonProps) => {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHasOpened(true);
    setOpen(true);
  };

  const base =
    "group/notify inline-flex items-center justify-center gap-2 font-josefin font-medium rounded-lg transition-colors active:scale-[0.98] bg-[#A36F5E] hover:bg-[#916253] text-white";
  const sizing =
    variant === "detail"
      ? "py-3 px-6 text-base w-full sm:w-auto"
      : "py-2.5 px-4 text-sm w-full";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Être prévenu de la disponibilité de ${productName}`}
        className={`${base} ${sizing} ${className}`}
      >
        {/* La cloche "vibre" légèrement au survol */}
        <Bell
          className="w-4 h-4 origin-top transition-transform duration-300 group-hover/notify:animate-bell-wiggle"
          aria-hidden="true"
        />
        Me prévenir
      </button>

      {hasOpened && (
        <NotifyModal
          open={open}
          onOpenChange={setOpen}
          productId={productId}
          productName={productName}
          productImage={productImage}
        />
      )}
    </>
  );
};

export default NotifyButton;
