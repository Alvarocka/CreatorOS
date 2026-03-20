import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { creatorGradients, creatorTheme } from '@/src/lib/theme';

export function QuickCaptureFab({ onPress }: { onPress?: () => void }) {
  async function handlePress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  }

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}>
      <LinearGradient colors={creatorGradients.warning} style={styles.gradient}>
        <View style={styles.badge}>
          <Feather color={creatorTheme.black} name="plus" size={18} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>TRY ME</Text>
          <Text style={styles.title}>Quick Capture</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  copy: {
    gap: 1,
  },
  eyebrow: {
    color: 'rgba(15, 14, 12, 0.72)',
    fontFamily: creatorTheme.fontMonoMedium,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  gradient: {
    alignItems: 'center',
    borderColor: 'rgba(232, 168, 76, 0.35)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 62,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  title: {
    color: creatorTheme.black,
    fontFamily: creatorTheme.fontUiExtraBold,
    fontSize: 18,
  },
  wrap: {
    borderRadius: 999,
    overflow: 'hidden',
    position: 'absolute',
    right: 18,
    shadowColor: '#000000',
    shadowOffset: {
      height: 18,
      width: 0,
    },
    shadowOpacity: 0.28,
    shadowRadius: 26,
  },
});
