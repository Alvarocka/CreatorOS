import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';

import { creatorTheme } from '@/src/lib/theme';
import { useAuth } from '@/src/providers/auth-provider';

export default function EntryIndex() {
  const { initialized } = useAuth();

  if (!initialized) {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: creatorTheme.background,
          flex: 1,
          justifyContent: 'center',
        }}>
        <ActivityIndicator color="#FFFFFF" size="large" />
      </View>
    );
  }

  return <Redirect href="/(app)/(tabs)" />;
}
