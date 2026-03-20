import { Text } from 'react-native';

import { GlassCard } from '@/src/components/glass-card';
import { ScreenShell } from '@/src/components/screen-shell';

export default function SetupScreen() {
  return (
    <ScreenShell
      heading="Configura CreatorOS Mobile"
      subheading="Agrega tus variables EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY para activar auth y sincronizacion.">
      <GlassCard>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginBottom: 8 }}>
          Variables necesarias
        </Text>
        <Text style={{ color: '#9CA7C6', fontSize: 14, lineHeight: 21 }}>
          Copia `mobile/.env.example` a `mobile/.env` y completa las claves publicas de Supabase.
        </Text>
      </GlassCard>
    </ScreenShell>
  );
}
