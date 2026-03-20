import type { PropsWithChildren, ReactNode } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { creatorGradients, creatorTheme } from '@/src/lib/theme';

export function ScreenShell({
  children,
  heading,
  subheading,
  rightSlot,
  refreshing,
  onRefresh,
}: PropsWithChildren<{
  heading: string;
  subheading?: string;
  rightSlot?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
}>) {
  return (
    <LinearGradient colors={creatorGradients.background} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                onRefresh={onRefresh}
                refreshing={Boolean(refreshing)}
                tintColor="#FFFFFF"
              />
            ) : undefined
          }>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.heading}>{heading}</Text>
              {subheading ? <Text style={styles.subheading}>{subheading}</Text> : null}
            </View>
            {rightSlot ? <View>{rightSlot}</View> : null}
          </View>
          {children}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 128,
  },
  gradient: {
    flex: 1,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerText: {
    flex: 1,
    gap: 8,
  },
  heading: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiExtraBold,
    fontSize: 34,
    letterSpacing: -1.2,
  },
  safeArea: {
    flex: 1,
  },
  subheading: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontUiMedium,
    fontSize: 15,
    lineHeight: 22,
  },
});
