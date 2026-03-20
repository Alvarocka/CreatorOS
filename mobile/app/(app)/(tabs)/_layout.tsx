import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { creatorTheme } from '@/src/lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        animation: 'fade',
        headerShown: false,
        sceneStyle: { backgroundColor: creatorTheme.background },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: creatorTheme.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: '#0D1324',
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: 84,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="grid" size={size} />
          ),
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
          tabBarIcon: ({ color, size }) => (
            <View style={styles.captureTabIcon}>
              <Feather color={color} name="plus" size={size} />
            </View>
          ),
          title: 'Captura',
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="folder" size={size} />
          ),
          title: 'Proyectos',
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
  );
}

const styles = StyleSheet.create({
  captureTabIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(243, 154, 74, 0.14)',
    borderColor: 'rgba(243, 154, 74, 0.32)',
    borderRadius: 999,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
});
