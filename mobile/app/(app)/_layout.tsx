import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="capture-modal"
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="studio/[id]" />
    </Stack>
  );
}
