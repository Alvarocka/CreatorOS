import { StyleSheet, Text, View } from 'react-native';

import { creatorTheme } from '@/src/lib/theme';

const toneMap = {
  audio: {
    border: 'rgba(255, 79, 216, 0.34)',
    value: '#FF7FE7',
  },
  neutral: {
    border: 'rgba(255,255,255,0.10)',
    value: '#F4F6FF',
  },
  video: {
    border: 'rgba(85, 230, 255, 0.30)',
    value: '#7DEBFF',
  },
  visual: {
    border: 'rgba(139, 107, 255, 0.28)',
    value: '#B69AFF',
  },
} as const;

export function CompactStatPill({
  label,
  tone = 'neutral',
  value,
}: {
  label: string;
  tone?: keyof typeof toneMap;
  value: number;
}) {
  return (
    <View style={[styles.pill, { borderColor: toneMap[tone].border }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: toneMap[tone].value }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontMono,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  pill: {
    backgroundColor: creatorTheme.panelStrong,
    borderRadius: creatorTheme.radiusLg,
    borderWidth: 1,
    gap: 6,
    minWidth: 108,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#050816',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
  value: {
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 22,
    letterSpacing: -0.6,
  },
});
