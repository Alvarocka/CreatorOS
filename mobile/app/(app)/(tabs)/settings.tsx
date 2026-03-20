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
      subheading="Tu identidad, acceso y la base de configuracion para la siguiente fase movil de CreatorOS.">
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
        <Text style={styles.bio}>
          {profile?.bio ||
            'La siguiente iteracion movil agregara edicion de perfil, idioma, notificaciones y preferencias offline.'}
        </Text>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Estado de la base movil</Text>
        <Text style={styles.bio}>
          Esta primera base nativa ya contempla auth, tabs, dashboard, biblioteca, captura y proyectos. El siguiente salto es sumar camara, voz, uploads y sync offline.
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
