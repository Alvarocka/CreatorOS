import { cookies } from "next/headers";

import { DEFAULT_LOCALE, LANGUAGE_COOKIE, normalizeLocale } from "@/lib/i18n";

export function getCurrentLocale() {
  const cookieStore = cookies();
  return normalizeLocale(cookieStore.get(LANGUAGE_COOKIE)?.value || DEFAULT_LOCALE);
}
