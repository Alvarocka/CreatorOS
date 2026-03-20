import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text } from 'react-native';

import { initials } from '@/src/lib/format';

export function AvatarBadge({ label }: { label?: string | null }) {
  return (
    <LinearGradient colors={['#FF7A00', '#FF2C96', '#7C3AED']} style={styles.badge}>
      <Text style={styles.text}>{initials(label)}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 999,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
