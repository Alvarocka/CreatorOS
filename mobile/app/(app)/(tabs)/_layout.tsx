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
          height: 82,
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
            <Feather color={color} name="plus-circle" size={size} />
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
