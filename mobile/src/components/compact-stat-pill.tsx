import { StyleSheet, Text, View } from 'react-native';

import { creatorTheme } from '@/src/lib/theme';

const toneMap = {
  audio: {
    border: 'rgba(255, 160, 74, 0.28)',
    value: '#FFB15C',
  },
  neutral: {
    border: 'rgba(255,255,255,0.08)',
    value: '#FFFFFF',
  },
  video: {
    border: 'rgba(108, 156, 255, 0.26)',
    value: '#8BB2FF',
  },
  visual: {
    border: 'rgba(125, 225, 170, 0.26)',
    value: '#79E2A9',
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
    backgroundColor: creatorTheme.panelSoft,
    borderRadius: creatorTheme.radiusLg,
    borderWidth: 1,
    gap: 6,
    minWidth: 108,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  value: {
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 22,
    letterSpacing: -0.6,
  },
});
