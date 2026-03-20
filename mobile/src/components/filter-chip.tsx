import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { creatorTheme } from '@/src/lib/theme';

export function FilterChip({
  active,
  children,
  onPress,
}: PropsWithChildren<{
  active?: boolean;
  onPress?: () => void;
}>) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.chipPressed,
      ]}>
      <Text style={[styles.text, active && styles.textActive]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: creatorTheme.panelSoft,
    borderColor: creatorTheme.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: 'rgba(232, 168, 76, 0.16)',
    borderColor: 'rgba(232, 168, 76, 0.55)',
  },
  chipPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontMonoMedium,
    fontSize: 12,
  },
  textActive: {
    color: creatorTheme.amber,
  },
});
