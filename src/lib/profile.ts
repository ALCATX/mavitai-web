export function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const birth = new Date(`${value}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return false;

  const today = startOfToday();
  if (birth >= today) return false;

  const age = ageFromBirthDate(value);
  return Number(age) >= 13 && Number(age) <= 100;
}

export function ageFromBirthDate(value: string): string {
  const birth = new Date(`${value}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return "";

  const today = startOfToday();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return String(age);
}

export function isBirthdayToday(value: string): boolean {
  if (!value) return false;
  const birth = new Date(`${value}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return false;
  const today = startOfToday();
  return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
}

export function maxBirthDateInput(): string {
  const limit = startOfToday();
  limit.setFullYear(limit.getFullYear() - 13);
  return toIsoDate(limit);
}

export function minBirthDateInput(): string {
  const limit = startOfToday();
  limit.setFullYear(limit.getFullYear() - 100);
  return toIsoDate(limit);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
