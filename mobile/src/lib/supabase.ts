import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { isMobileConfigured, mobileEnv } from '@/src/lib/env';

export const supabase = createClient(
  mobileEnv.supabaseUrl || 'https://placeholder.supabase.co',
  mobileEnv.supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: AsyncStorage,
    },
  }
);

export { isMobileConfigured };
