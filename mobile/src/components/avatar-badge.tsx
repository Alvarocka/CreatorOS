import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text } from 'react-native';

import { initials } from '@/src/lib/format';
import { creatorGradients, creatorTheme } from '@/src/lib/theme';

export function AvatarBadge({ label }: { label?: string | null }) {
  return (
    <LinearGradient colors={creatorGradients.primary} style={styles.badge}>
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
    shadowColor: '#050816',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.26,
    shadowRadius: 20,
    width: 48,
  },
  text: {
    color: creatorTheme.white,
    fontFamily: creatorTheme.fontUiExtraBold,
    fontSize: 16,
  },
});
