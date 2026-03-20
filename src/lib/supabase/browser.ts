"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/types/database";
import { assertSupabaseConfigured } from "@/lib/supabase/env";

export function createBrowserSupabaseClient() {
  const { url, anonKey } = assertSupabaseConfigured();

  return createBrowserClient<Database>(url, anonKey) as any;
}
