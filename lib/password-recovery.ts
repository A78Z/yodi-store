export type PasswordResetFields = { code: string; password: string; confirmPassword: string };

export function passwordResetError(fields: PasswordResetFields): string {
  if (!/^\d{6}$/.test(fields.code)) return "Saisissez le code à 6 chiffres reçu par email.";
  if (fields.password !== fields.confirmPassword) return "Les mots de passe ne correspondent pas.";
  if (fields.password.length < 6) return "Le mot de passe doit contenir au moins 6 caractères.";
  return "";
}

export function passwordResetPayload(email: string, fields: PasswordResetFields) {
  return { email: email.trim(), code: fields.code, password: fields.password };
}
