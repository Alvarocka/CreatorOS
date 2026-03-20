import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/lib/types/database";
import { assertSupabaseConfigured } from "@/lib/supabase/env";

export async function createServerSupabaseClient() {
  const cookieStore = cookies();
  const { url, anonKey } = assertSupabaseConfigured();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
      ) {
        try {
          const writableCookieStore = cookieStore as unknown as {
            set: (name: string, value: string, options: Record<string, unknown>) => void;
          };

          cookiesToSet.forEach(({ name, value, options }) =>
            writableCookieStore.set(name, value, options as Record<string, unknown>)
          );
        } catch {
          // Cookies can be read-only in some server component contexts.
        }
      }
    }
  }) as any;
}
