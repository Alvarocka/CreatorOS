import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { LOCAL_WORKSPACE_ID, loadWorkspaceProfile, saveWorkspaceProfile } from '@/src/lib/workspace';
import type { Profile } from '@/src/types/app';

type LocalSession = {
  mode: 'local';
};

type LocalUser = {
  email: string | null;
  id: string;
};

type AuthContextValue = {
  initialized: boolean;
  isConfigured: boolean;
  profile: Profile | null;
  session: LocalSession | null;
  signIn: (params: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (params: {
    displayName: string;
    email: string;
    password: string;
  }) => Promise<{ needsEmailConfirmation: boolean }>;
  updateProfile: (patch: Partial<Pick<Profile, 'bio' | 'display_name' | 'username'>>) => Promise<void>;
  user: LocalUser | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const localSession: LocalSession = {
  mode: 'local',
};

const localUser: LocalUser = {
  email: null,
  id: LOCAL_WORKSPACE_ID,
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [initialized, setInitialized] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const nextProfile = await loadWorkspaceProfile();

      if (!mounted) return;

      setProfile(nextProfile);
      setInitialized(true);
    }

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      initialized,
      isConfigured: true,
      profile,
      session: localSession,
      signIn: async () => {},
      signOut: async () => {},
      signUp: async ({ displayName }) => {
        const nextProfile: Profile = {
          ...(profile || {
            avatar_url: null,
            bio: '',
            created_at: new Date().toISOString(),
            display_name: 'Creator',
            id: LOCAL_WORKSPACE_ID,
            username: 'local-device',
          }),
          display_name: displayName.trim() || 'Creator',
          updated_at: new Date().toISOString(),
        };

        await saveWorkspaceProfile(nextProfile);
        setProfile(nextProfile);

        return {
          needsEmailConfirmation: false,
        };
      },
      updateProfile: async (patch) => {
        const nextProfile: Profile = {
          ...(profile || {
            avatar_url: null,
            bio: '',
            display_name: 'Creator',
            id: LOCAL_WORKSPACE_ID,
            username: 'local-device',
          }),
          ...patch,
          updated_at: new Date().toISOString(),
        };

        await saveWorkspaceProfile(nextProfile);
        setProfile(nextProfile);
      },
      user: localUser,
    }),
    [initialized, profile]
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
