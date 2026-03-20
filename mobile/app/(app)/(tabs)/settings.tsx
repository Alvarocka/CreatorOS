import { Alert, StyleSheet, Text, View } from 'react-native';

import { AvatarBadge } from '@/src/components/avatar-badge';
import { GlassCard } from '@/src/components/glass-card';
import { GradientButton } from '@/src/components/gradient-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { creatorTheme } from '@/src/lib/theme';
import { useAuth } from '@/src/providers/auth-provider';

export default function SettingsScreen() {
  const { profile, signOut, user } = useAuth();

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      Alert.alert(
        'No pudimos cerrar sesion',
        error instanceof Error ? error.message : 'Intenta nuevamente.'
      );
    }
  }

  return (
    <ScreenShell
      heading="Ajustes"
      subheading="Base de cuenta, estado del dispositivo y lo que dejamos en pausa para mantener el foco en el documento multimedia.">
      <GlassCard>
        <View style={styles.profileHeader}>
          <AvatarBadge label={profile?.display_name || profile?.username || user?.email} />
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>
              {profile?.display_name || profile?.username || 'CreatorOS'}
            </Text>
            <Text style={styles.profileMeta}>@{profile?.username || 'sin-username'}</Text>
            <Text style={styles.profileMeta}>{user?.email}</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Modo documento local</Text>
        <Text style={styles.bio}>
          Los audios, videos e imagenes capturados desde movil viven localmente en este dispositivo
          por ahora. La idea es ayudarte a trabajar rapido sin subir peso innecesario a la nube.
        </Text>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Perfil publico opcional pronto</Text>
        <Text style={styles.bio}>
          La vitrina publica queda congelada en esta fase. Primero vamos a pulir la experiencia de
          capturar, reproducir y escribir al mismo tiempo.
        </Text>
      </GlassCard>

      <GradientButton onPress={handleLogout} variant="ghost">
        Cerrar sesion
      </GradientButton>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  bio: {
    color: creatorTheme.textMuted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
  },
  profileCopy: {
    flex: 1,
    gap: 4,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  profileMeta: {
    color: creatorTheme.textMuted,
    fontSize: 13,
  },
  profileName: {
    color: creatorTheme.text,
    fontSize: 20,
    fontWeight: '900',
  },
  sectionTitle: {
    color: creatorTheme.text,
    fontSize: 24,
    fontWeight: '900',
  },
});
