export type RegistrationFields = {
  firstname: string; lastname: string; email: string; phone: string;
  address: string; city: string; zip: string; country: string;
  password: string; confirmPassword: string;
};

export function registrationPasswordError(password: string, confirmation: string): string {
  if (password !== confirmation) return "Les mots de passe ne correspondent pas.";
  if (password.length < 6) return "Le mot de passe doit contenir au moins 6 caractères.";
  return "";
}

// Explicit allowlist: never send the confirmation field or normalize the password.
export function registrationPayload(fields: RegistrationFields) {
  return {
    firstname: fields.firstname.trim(), lastname: fields.lastname.trim(),
    email: fields.email.trim(), phone: fields.phone.trim(), address: fields.address.trim(),
    city: fields.city.trim(), zip: fields.zip.trim(), country: fields.country,
    password: fields.password,
  };
}

export function sanitizeVerificationCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

export function isVerificationCode(value: string): boolean {
  return /^\d{6}$/.test(value);
}
