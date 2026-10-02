// Upgrade legacy carts without changing quantities, prices or other fields.
export function compactCartImages<T extends { id: string; imageUrl: string; updatedAt?: string | Date }>(carts: T[]): T[] {
  return carts.map(cart => {
    if (!/^[a-f\d]{24}$/i.test(cart.id) || !/^data:image\/(?:png|jpeg|webp|avif|gif);base64,/.test(cart.imageUrl)) return cart;
    const version = cart.updatedAt ? new Date(cart.updatedAt).getTime() : 0;
    return { ...cart, imageUrl: `/api/product-images/${cart.id}?v=${Number.isFinite(version) ? version : 0}` };
  });
}
