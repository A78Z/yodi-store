export type ProfileFields = { firstname: string; lastname: string; phone: string; address: string; city: string; country: string; zip: string };
export type ProfilePasswords = { old: string; next: string; confirm: string };

export function profilePasswordError(passwords: ProfilePasswords) {
  if (!passwords.old && !passwords.next && !passwords.confirm) return "";
  if (!passwords.old || !passwords.next || !passwords.confirm) return "Renseignez les trois champs pour changer de mot de passe.";
  if (passwords.next.length < 6) return "Le nouveau mot de passe doit contenir au moins 6 caractères.";
  if (passwords.next !== passwords.confirm) return "Les nouveaux mots de passe ne correspondent pas.";
  return "";
}

export function profileFields(data: ProfileFields): ProfileFields {
  return { firstname: data.firstname, lastname: data.lastname, phone: data.phone, address: data.address, city: data.city, country: data.country, zip: data.zip };
}

export function profilePayload(data: ProfileFields, passwords: ProfilePasswords) {
  return { ...profileFields(data), ...(passwords.old && passwords.next ? { oldPassword: passwords.old, newPassword: passwords.next } : {}) };
}

export const orderSteps = ["pending", "processing", "delivered"] as const;
export function orderProgress(status: string) { return orderSteps.findIndex(step => step === status); }
export function orderStatusLabel(status: string) {
  return ({ pending: "En attente", processing: "En préparation", delivered: "Livrée", cancelled: "Annulée" } as Record<string, string>)[status] || "Statut à confirmer";
}
