import type { PropsWithChildren } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { creatorGradients, creatorTheme } from '@/src/lib/theme';

type Variant = 'primary' | 'info' | 'success' | 'ghost';

export function GradientButton({
  children,
  disabled,
  loading,
  onPress,
  variant = 'primary',
}: PropsWithChildren<{
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  variant?: Variant;
}>) {
  if (variant === 'ghost') {
    return (
      <Pressable
        disabled={disabled || loading}
        onPress={onPress}
        style={({ pressed }) => [
          styles.ghostButton,
          pressed && styles.pressed,
          (disabled || loading) && styles.disabled,
        ]}>
        {loading ? (
          <ActivityIndicator color={creatorTheme.text} />
        ) : (
          <Text style={styles.ghostText}>{children}</Text>
        )}
      </Pressable>
    );
  }

  const colors =
    variant === 'info'
      ? creatorGradients.info
      : variant === 'success'
        ? creatorGradients.success
        : creatorGradients.primary;

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonWrap,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}>
      <LinearGradient colors={colors} style={styles.gradient}>
        <View style={styles.innerGlow} />
        {loading ? (
          <ActivityIndicator color={creatorTheme.text} />
        ) : (
          <Text style={styles.text}>{children}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonWrap: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.6,
  },
  ghostButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: creatorTheme.border,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 20,
  },
  ghostText: {
    color: creatorTheme.text,
    fontSize: 16,
    fontWeight: '800',
  },
  gradient: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 54,
    overflow: 'hidden',
    paddingHorizontal: 22,
  },
  innerGlow: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    height: 16,
    position: 'absolute',
    right: 22,
    top: 8,
    width: 56,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  text: {
    color: creatorTheme.text,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
});
