import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { creatorTheme } from '@/src/lib/theme';

export function TextField({
  label,
  multiline,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        multiline={multiline}
        placeholderTextColor={creatorTheme.textMuted}
        style={[styles.input, multiline && styles.textarea]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: creatorTheme.panelSoft,
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusLg,
    borderWidth: 1,
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiMedium,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontMonoMedium,
    fontSize: 14,
    marginBottom: 8,
  },
  textarea: {
    minHeight: 132,
    textAlignVertical: 'top',
  },
  wrap: {
    width: '100%',
  },
});
