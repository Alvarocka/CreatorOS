"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { LANGUAGE_COOKIE, normalizeLocale, type AppLocale } from "@/lib/i18n";
import type { ActionResult } from "@/lib/actions/utils";

export async function saveLocalePreferenceAction(values: unknown): Promise<ActionResult<{ locale: AppLocale }>> {
  const locale = normalizeLocale(
    typeof values === "object" && values && "locale" in values
      ? String((values as { locale?: string }).locale)
      : null
  );

  cookies().set(LANGUAGE_COOKIE, locale, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax"
  });

  revalidatePath("/");

  return {
    success: true,
    message: locale === "en" ? "Language updated." : "Idioma actualizado.",
    data: { locale }
  };
}
