type ProductSnapshot = {
  _id: unknown; price: number; discount?: number; stock: number; disponible?: boolean;
};
type RequestedItem = { id: string; quantity: number; price?: number; discount?: number };

// Pure validation: never trust stock or prices persisted in the browser cart.
export function validateCheckoutProducts(items: RequestedItem[], products: ProductSnapshot[]) {
  if (!Array.isArray(items) || !items.length || items.length > 100) throw new Error("Panier invalide");
  const quantities = new Map<string, number>();
  for (const item of items) {
    if (!item || !/^[a-f\d]{24}$/i.test(item.id) || !Number.isSafeInteger(item.quantity) || item.quantity < 1) {
      throw new Error("Quantité invalide");
    }
    quantities.set(item.id, (quantities.get(item.id) || 0) + item.quantity);
  }
  let subtotal = 0;
  const validated = [...quantities].map(([id, quantity]) => {
    const product = products.find(p => String(p._id) === id);
    if (!product || product.disponible === false || product.stock < quantity) throw new Error("Un produit n’est plus disponible dans la quantité demandée");
    subtotal += (product.price - product.price * (product.discount || 0) / 100) * quantity;
    return { product, id, quantity };
  });
  const pricesChanged = items.some(item => {
    const product = products.find(p => String(p._id) === item.id);
    return item.price !== undefined && product &&
      (item.price !== product.price || (item.discount || 0) !== (product.discount || 0));
  });
  return { validated, subtotal, pricesChanged };
}
