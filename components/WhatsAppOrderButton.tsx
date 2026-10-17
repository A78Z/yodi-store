"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { CART } from "@/lib/types/types";
import type { IProduct } from "@/lib/models/product";
import { FaWhatsapp } from "react-icons/fa";
import { Content as DialogContent } from "@radix-ui/react-dialog";
import { Dialog, DialogOverlay, DialogPortal, DialogTrigger } from "@/components/ui/dialog";
import WhatsAppOrderForm from "./WhatsAppOrderForm";
import styles from "./WhatsAppOrderButton.module.css";
import formStyles from "./WhatsAppOrderForm.module.css";

export type WhatsAppOrderProduct = Pick<IProduct, "price" | "discount" | "stock" | "disponible" | "imageUrl" | "category" | "subCategory"> & { _id: unknown };

export type WhatsAppOrderButtonProps = {
  product: WhatsAppOrderProduct;
  name: string;
  displayedPrice: string;
  initialQuantity?: number;
} | {
  cartItems: Array<CART & { disponible?: boolean }>;
};

export default function WhatsAppOrderButton(props: WhatsAppOrderButtonProps) {
  const cartMode = "cartItems" in props;
  const [open, setOpen] = useState(false);
  const [viewport, setViewport] = useState<{ height: number; top: number } | null>(null);
  useEffect(() => {
    if (!open || !window.visualViewport) return;
    const visual = window.visualViewport;
    const sync = () => setViewport({ height: visual.height, top: visual.offsetTop });
    sync();
    visual.addEventListener("resize", sync);
    visual.addEventListener("scroll", sync);
    return () => { visual.removeEventListener("resize", sync); visual.removeEventListener("scroll", sync); };
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={styles.button} aria-label={cartMode ? "Commander tout le panier sur WhatsApp" : `Commander sur WhatsApp : ${props.name}`}>
          <FaWhatsapp size={19} aria-hidden="true" />
          <span>Commander sur WhatsApp</span>
        </button>
      </DialogTrigger>
      <DialogPortal>
      <DialogOverlay className={formStyles.overlay} />
      <DialogContent style={viewport ? { "--order-viewport-height": `${viewport.height}px`, "--order-viewport-top": `${viewport.top}px` } as CSSProperties : undefined} className={formStyles.modal} onOpenAutoFocus={(event) => event.preventDefault()}>
        {open && <WhatsAppOrderForm {...props} />}
      </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
