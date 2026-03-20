import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/src/providers/auth-provider';

export default function AppLayout() {
  const { initialized, session } = useAuth();

  if (initialized && !session) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
