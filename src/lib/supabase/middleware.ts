import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import type { Database } from "@/lib/types/database";
import { getSupabaseConfig } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  const { url, anonKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return NextResponse.next({
      request
    });
  }

  let response = NextResponse.next({
    request
  });

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
      ) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options as Record<string, unknown>);
        });
      }
    }
  });

  await supabase.auth.getUser();
  return response;
}
