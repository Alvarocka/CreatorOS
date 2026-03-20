export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  return {
    url,
    anonKey,
    serviceRoleKey,
    isConfigured: Boolean(url && anonKey)
  };
}

export function assertSupabaseConfigured() {
  const config = getSupabaseConfig();

  if (!config.isConfigured) {
    throw new Error("Supabase no está configurado. Revisa tu archivo .env.local.");
  }

  return config;
}
