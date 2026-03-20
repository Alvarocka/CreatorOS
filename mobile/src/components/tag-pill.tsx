import { StyleSheet, Text, View } from 'react-native';

import { creatorTheme } from '@/src/lib/theme';

export function TagPill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>#{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: 'rgba(232, 168, 76, 0.10)',
    borderColor: 'rgba(232, 168, 76, 0.35)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    color: creatorTheme.amber,
    fontFamily: creatorTheme.fontMonoMedium,
    fontSize: 11,
  },
});
