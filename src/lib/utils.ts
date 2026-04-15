import { clsx } from "clsx";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { ru } from "date-fns/locale";
import crypto from "node:crypto";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: Date | string, dateFormat = "d MMMM yyyy") {
  return format(new Date(value), dateFormat, { locale: ru });
}

export function calculateNights(startDate: Date, endDate: Date) {
  return Math.max(1, differenceInCalendarDays(endDate, startDate));
}

export function addBusinessDays(date: Date, days: number) {
  return addDays(date, days);
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, hash: string) {
  const [salt, stored] = hash.split(":");
  if (!salt || !stored) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(stored, "hex"), Buffer.from(derived, "hex"));
}

export function bookingDateInfo(startDate: Date, endDate: Date) {
  const nights = calculateNights(startDate, endDate);
  return {
    nights,
    label: `${formatDate(startDate, "d MMM")} — ${formatDate(endDate, "d MMM")}, ${nights} ${declineNights(nights)}`,
  };
}

function declineNights(value: number) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return "ночь";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "ночи";
  return "ночей";
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}
