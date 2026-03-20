import { formatDistanceToNowStrict } from "date-fns";
import { enUS, es } from "date-fns/locale";

import type { AppLocale } from "@/lib/i18n";

export function formatRelativeDate(date: string | Date, locale: AppLocale = "es") {
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
    locale: locale === "en" ? enUS : es
  });
}

export function formatTimestamp(seconds?: number | null) {
  if (seconds == null) return "Sin marca";

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

export function initialsFromName(name?: string | null) {
  if (!name) return "CO";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase())
    .join("");
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function ensureAbsoluteUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return new URL(path, baseUrl).toString();
}
