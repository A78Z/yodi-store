// Limite de quantité côté fiche ; le checkout conserve sa validation en base.
export function remainingProductQuantity(stock: number, inCart: number): number {
  if (!Number.isFinite(stock) || stock <= 0) return 0;
  const reserved = Number.isFinite(inCart) ? Math.max(0, Math.floor(inCart)) : 0;
  return Math.max(0, Math.floor(stock) - reserved);
}
