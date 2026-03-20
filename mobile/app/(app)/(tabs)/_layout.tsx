import { StyleSheet, View } from 'react-native';
import { Tabs, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { QuickCaptureFab } from '@/src/components/quick-capture-fab';
import { creatorTheme } from '@/src/lib/theme';

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          animation: 'fade',
          headerShown: false,
          sceneStyle: { backgroundColor: creatorTheme.background },
          tabBarActiveTintColor: creatorTheme.blue,
          tabBarInactiveTintColor: creatorTheme.textMuted,
          tabBarLabelStyle: {
            fontFamily: creatorTheme.fontMonoMedium,
            fontSize: 11,
            marginBottom: 4,
          },
          tabBarStyle: {
            backgroundColor: creatorTheme.backgroundElevated,
            borderTopColor: creatorTheme.borderSoft,
            height: 84,
            paddingTop: 8,
            shadowColor: '#050816',
            shadowOffset: { height: -10, width: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 24,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size }) => <Feather color={color} name="grid" size={size} />,
            title: 'Inicio',
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather color={color} name="book-open" size={size} />
            ),
            title: 'Biblioteca',
          }}
        />
        <Tabs.Screen
          name="capture"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather color={color} name="settings" size={size} />
            ),
            title: 'Ajustes',
          }}
        />
      </Tabs>
      <QuickCaptureFab onPress={() => router.push('/(app)/capture-modal')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
