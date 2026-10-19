// Calcul et affichage des prix (mêmes règles que le carrousel actuel).
// Les prix sont stockés en FCFA (XOF) ; l'USD est converti via usdRate.

export type Currency = "XOF" | "USD";

export function discountedPrice(price: number, discount?: number): number {
  return discount && discount > 0 ? price - (price * discount) / 100 : price;
}

export function formatMoney(amountXof: number, currency: Currency, usdRate: number): string {
  if (currency === "XOF") {
    return `${new Intl.NumberFormat("fr-FR").format(Math.round(amountXof))} FCFA`;
  }
  return `${(amountXof / Number(usdRate || 1)).toFixed(2)} USD`;
}

export function productHref(product: { _id: unknown; category: string; subCategory?: string }): string {
  return `/${product.category}/${product.subCategory || "product"}/${String(product._id)}`;
}

// Keep full XOF precision until display, including when several units are ordered.
export function cartTotals(items: ReadonlyArray<{ price: number; discount?: number; quantity: number }>) {
  return items.reduce((totals, item) => ({
    quantity: totals.quantity + item.quantity,
    subtotal: totals.subtotal + discountedPrice(item.price, item.discount) * item.quantity,
    savings: totals.savings + (item.price - discountedPrice(item.price, item.discount)) * item.quantity,
  }), { quantity: 0, subtotal: 0, savings: 0 });
}
