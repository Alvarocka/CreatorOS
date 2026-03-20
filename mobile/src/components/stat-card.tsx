import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { GlassCard } from '@/src/components/glass-card';

const tones = {
  blue: ['#1E66FF', '#2450E9', '#153C9E'] as const,
  pink: ['#B72BFF', '#FF2F9A', '#7629F2'] as const,
  orange: ['#FFB000', '#FF7A00', '#FF5D00'] as const,
  green: ['#59D64E', '#22B962', '#0E8D44'] as const,
};

export function StatCard({
  description,
  label,
  tone,
  value,
}: {
  description: string;
  label: string;
  tone: keyof typeof tones;
  value: number;
}) {
  return (
    <GlassCard style={styles.card}>
      <LinearGradient colors={tones[tone]} style={styles.gradient}>
        <View style={styles.sparkleOne} />
        <View style={styles.sparkleTwo} />
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.description}>{description}</Text>
      </LinearGradient>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    padding: 0,
  },
  description: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
  },
  gradient: {
    minHeight: 148,
    padding: 18,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sparkleOne: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    height: 12,
    position: 'absolute',
    right: 22,
    top: 18,
    transform: [{ rotate: '45deg' }],
    width: 12,
  },
  sparkleTwo: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 3,
    height: 9,
    position: 'absolute',
    right: 42,
    top: 42,
    transform: [{ rotate: '45deg' }],
    width: 9,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
    marginTop: 8,
  },
});
