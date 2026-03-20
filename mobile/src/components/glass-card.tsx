import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { creatorTheme } from '@/src/lib/theme';

export function GlassCard({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: creatorTheme.panel,
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusXl,
    borderWidth: 1,
    padding: 18,
  },
});
