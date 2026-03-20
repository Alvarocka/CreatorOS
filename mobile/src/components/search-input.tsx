import type { TextInputProps } from 'react-native';
import { StyleSheet, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { creatorTheme } from '@/src/lib/theme';

export function SearchInput(props: TextInputProps) {
  return (
    <View style={styles.shell}>
      <Feather color={creatorTheme.textMuted} name="search" size={16} />
      <TextInput
        placeholderTextColor={creatorTheme.textSubtle}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    color: creatorTheme.text,
    flex: 1,
    fontFamily: creatorTheme.fontUiMedium,
    fontSize: 15,
    minHeight: 50,
  },
  shell: {
    alignItems: 'center',
    backgroundColor: creatorTheme.panelStrong,
    borderColor: creatorTheme.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 16,
    shadowColor: '#040610',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
});
