// The caller supplies the exact name/price displayed on its card.
export function whatsappOrderHref(name: string, displayedPrice: string, publicProductUrl: string, phone: string): string {
  const message = `Bonjour Yodi-K, je souhaite commander ce produit : ${name}. Prix affiché : ${displayedPrice}. Lien : ${publicProductUrl}.`;
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
