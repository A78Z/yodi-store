// Configuration centralisée du site.
// Source unique de vérité pour le domaine, l'email et les numéros de contact.
// En cas de changement (domaine, email pro…), modifier ICI uniquement.

export const SITE_URL = "https://yodi-k.com";
export const ADMIN_URL = "https://admin.yodi-k.com";

// Email de contact affiché publiquement (footer, CGV…).
// TODO: passer à "contact@yodi-k.com" une fois la boîte mail du domaine créée.
export const CONTACT_EMAIL = "yodistores@gmail.com";

// Numéros de téléphone (format affiché + format E.164 pour les liens tel:/wa.me)
export const PHONE_SN = { label: "+221 78 968 96 98", tel: "+221789689698" }; // Service / Sénégal
export const PHONE_CA = { label: "+1 819 290 8365", tel: "+18192908365" }; // Canada
export const PHONE_COMMERCIAL = { label: "+221 78 012 84 86", tel: "+221780128486" }; // Commercial
export const WHATSAPP = "221789689698";
