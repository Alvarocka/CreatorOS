import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { fetchProfile, upsertProfileFromSignup } from '@/src/lib/mobile-data';
import { isMobileConfigured, supabase } from '@/src/lib/supabase';
import type { Profile } from '@/src/types/app';

type AuthContextValue = {
  initialized: boolean;
  isConfigured: boolean;
  profile: Profile | null;
  session: Session | null;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (params: {
    displayName: string;
    email: string;
    password: string;
  }) => Promise<{ needsEmailConfirmation: boolean }>;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [initialized, setInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!isMobileConfigured) {
      setInitialized(true);
      return;
    }

    let mounted = true;

    async function bootstrap() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(currentSession);

      if (currentSession?.user?.id) {
        const nextProfile = await fetchProfile(currentSession.user.id);
        if (mounted) setProfile(nextProfile);
      }

      if (mounted) setInitialized(true);
    }

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return;

      setSession(nextSession);

      if (nextSession?.user?.id) {
        const nextProfile = await fetchProfile(nextSession.user.id);
        if (mounted) setProfile(nextProfile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      initialized,
      isConfigured: isMobileConfigured,
      profile,
      session,
      signIn: async ({ email, password }) => {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
      signUp: async ({ displayName, email, password }) => {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: displayName.trim(),
            },
          },
        });

        if (error) throw error;

        if (data.user && data.session) {
          await upsertProfileFromSignup({
            displayName,
            email,
            userId: data.user.id,
          });
          const nextProfile = await fetchProfile(data.user.id);
          setProfile(nextProfile);
        }

        return {
          needsEmailConfirmation: !data.session,
        };
      },
      user: session?.user || null,
    }),
    [initialized, profile, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
