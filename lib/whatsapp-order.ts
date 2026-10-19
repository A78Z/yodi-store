export type PhoneCountry = "SN" | "CA";
export type WhatsAppOrderFields = {
  phoneCountry: PhoneCountry;
  phone: string;
  street: string;
  city: string;
  deliveryCountry: string;
  customerName: string;
  note: string;
  quantity: number;
};
export type WhatsAppOrderErrors = Partial<Record<"phone" | "street" | "city" | "deliveryCountry" | "quantity", string>>;

export function normalizeOrderPhone(value: string, country: PhoneCountry): string | null {
  if (/[^\d\s()+.\-]/.test(value)) return null;
  let digits = value.replace(/\D/g, "");
  const prefix = country === "SN" ? "221" : "1";
  const length = country === "SN" ? 9 : 10;
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === length + prefix.length && digits.startsWith(prefix)) digits = digits.slice(prefix.length);
  const valid = country === "SN" ? /^[1-9]\d{8}$/.test(digits) : /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
  return valid ? `+${prefix}${digits}` : null;
}

export function validateWhatsAppOrder(fields: WhatsAppOrderFields, maxQuantity: number): WhatsAppOrderErrors {
  const errors: WhatsAppOrderErrors = {};
  if (!normalizeOrderPhone(fields.phone, fields.phoneCountry)) errors.phone = fields.phoneCountry === "SN"
    ? "Indique un numéro sénégalais de 9 chiffres, avec ou sans +221."
    : "Indique un numéro canadien de 10 chiffres, avec ou sans +1 (ex. 819 555 0123).";
  if (fields.street.trim().length < 3) errors.street = "Indique ton quartier ou ta rue (au moins 3 caractères).";
  if (fields.city.trim().length < 2) errors.city = "Indique ta ville (au moins 2 caractères).";
  if (!fields.deliveryCountry.trim()) errors.deliveryCountry = "Indique le pays de livraison.";
  if (!Number.isSafeInteger(fields.quantity) || fields.quantity < 1 || fields.quantity > maxQuantity) {
    errors.quantity = maxQuantity < 1 ? "Ce produit n’est pas disponible à la commande pour le moment." : `Choisis une quantité entre 1 et ${maxQuantity}.`;
  }
  return errors;
}

export function validWhatsAppProductLink(name: string, publicProductUrl: string): boolean {
  if (!name.trim()) return false;
  try {
    const url = new URL(publicProductUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    return url.origin === "https://yodi-k.com" && !url.username && !url.password && !url.search && !url.hash
      && parts.length === 3 && !["undefined", "null"].includes(parts[2]);
  } catch { return false; }
}

function contactMessageLines(fields: WhatsAppOrderFields): string[] {
  return [
    "",
    ...(fields.customerName.trim() ? [`Nom : ${fields.customerName.trim()}`] : []),
    `Téléphone du client : ${normalizeOrderPhone(fields.phone, fields.phoneCountry)}`,
    `Adresse de livraison : ${fields.street.trim()}, ${fields.city.trim()}, ${fields.deliveryCountry.trim()}`,
    ...(fields.note.trim() ? [`Note : ${fields.note.trim()}`] : []),
    "", "Merci de me confirmer la disponibilité et le montant total avec livraison.",
  ];
}

// The recipient is always the merchant, never a customer-supplied phone number.
function finalWhatsAppHref(messageLines: string[]): string {
  return `https://wa.me/221780128486?text=${encodeURIComponent(messageLines.join("\n"))}`;
}

// Called only by the final action. No customer data is placed in the site's URL or storage.
export function whatsappOrderHref(order: {
  name: string; displayedPrice: string; displayedSubtotal: string; publicProductUrl: string;
  fields: WhatsAppOrderFields; maxQuantity: number;
}): string {
  if (Object.keys(validateWhatsAppOrder(order.fields, order.maxQuantity)).length) throw new Error("Coordonnées ou quantité invalides");
  if (!validWhatsAppProductLink(order.name, order.publicProductUrl)) throw new Error("Produit invalide");
  return finalWhatsAppHref([
    "Bonjour Yodi-K, je souhaite passer une commande.", "",
    `Produit : ${order.name}`,
    `Quantité : ${order.fields.quantity}`,
    `Prix unitaire : ${order.displayedPrice}`,
    `Sous-total produits : ${order.displayedSubtotal}`,
    "Livraison : frais à confirmer",
    `Lien du produit : ${order.publicProductUrl}`,
    ...contactMessageLines(order.fields),
  ]);
}

export type WhatsAppCartLine = {
  name: string;
  quantity: number;
  maxQuantity: number;
  displayedPrice: string;
  displayedLineTotal: string;
  publicProductUrl: string;
};

export function validateWhatsAppCartOrder(fields: WhatsAppOrderFields, lines: ReadonlyArray<WhatsAppCartLine>): WhatsAppOrderErrors {
  const errors = validateWhatsAppOrder({ ...fields, quantity: 1 }, 1);
  if (lines.length === 0) errors.quantity = "Le panier est vide.";
  for (const line of lines) {
    if (!Number.isSafeInteger(line.quantity) || line.quantity < 1 || line.quantity > line.maxQuantity) {
      errors.quantity = line.maxQuantity < 1 ? `${line.name} n’est pas disponible à la commande pour le moment.` : `${line.name} : choisis une quantité entre 1 et ${line.maxQuantity}.`;
      break;
    }
  }
  return errors;
}

export function whatsappCartOrderHref(order: {
  lines: ReadonlyArray<WhatsAppCartLine>; displayedSubtotal: string; fields: WhatsAppOrderFields;
}): string {
  if (Object.keys(validateWhatsAppCartOrder(order.fields, order.lines)).length) throw new Error("Coordonnées ou panier invalides");
  if (order.lines.some(line => !validWhatsAppProductLink(line.name, line.publicProductUrl))) throw new Error("Produit invalide");
  return finalWhatsAppHref([
    "Bonjour Yodi-K, je souhaite passer une commande.",
    ...order.lines.flatMap((line, index) => [
      "", `Produit ${index + 1} : ${line.name}`,
      `Quantité : ${line.quantity}`, `Prix unitaire : ${line.displayedPrice}`,
      `Total produit : ${line.displayedLineTotal}`, `Lien du produit : ${line.publicProductUrl}`,
    ]),
    "", `Sous-total produits : ${order.displayedSubtotal}`,
    "Livraison : frais à confirmer",
    ...contactMessageLines(order.fields),
  ]);
}
