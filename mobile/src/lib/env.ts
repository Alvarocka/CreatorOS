export const mobileEnv = {
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
};

export const isMobileConfigured = Boolean(
  mobileEnv.supabaseAnonKey && mobileEnv.supabaseUrl
);
