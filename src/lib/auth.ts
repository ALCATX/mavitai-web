export function isValidContact(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

export function isValidPassword(value: string): boolean {
  return value.length >= 6;
}

export function passwordsMatch(password: string, confirm: string): boolean {
  return password.length > 0 && password === confirm;
}
