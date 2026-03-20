import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/src/providers/auth-provider';

export default function AuthLayout() {
  const { initialized, session } = useAuth();

  if (initialized && session) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
