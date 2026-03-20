import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AvatarBadge } from '@/src/components/avatar-badge';
import { GlassCard } from '@/src/components/glass-card';
import { GradientButton } from '@/src/components/gradient-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { TextField } from '@/src/components/text-field';
import { creatorTheme } from '@/src/lib/theme';
import { useAuth } from '@/src/providers/auth-provider';

export default function SettingsScreen() {
  const { profile, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || 'Creator');
  const [username, setUsername] = useState(profile?.username || 'local-device');
  const [bio, setBio] = useState(
    profile?.bio || 'Workspace local-first para capturar ideas multimedia sin depender de la nube.'
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);

    try {
      await updateProfile({
        bio,
        display_name: displayName.trim() || 'Creator',
        username: username.trim().toLowerCase().replace(/\s+/g, '-') || 'local-device',
      });
      Alert.alert('Guardado', 'El perfil local de este dispositivo fue actualizado.');
    } catch (error) {
      Alert.alert(
        'No pudimos guardar',
        error instanceof Error ? error.message : 'Intenta nuevamente.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenShell
      heading="Settings"
      subheading="CreatorOS móvil funciona como espacio local primero: el foco está en capturar, reproducir y documentar sin depender de cuentas o almacenamiento remoto.">
      <GlassCard>
        <View style={styles.profileHeader}>
          <AvatarBadge label={displayName || 'Creator'} />
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>{displayName || 'Creator'}</Text>
            <Text style={styles.profileMeta}>@{username || 'local-device'}</Text>
            <Text style={styles.profileMeta}>workspace local</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Workspace identity</Text>
        <View style={styles.form}>
          <TextField label="Display name" onChangeText={setDisplayName} value={displayName} />
          <TextField label="Slug local" onChangeText={setUsername} value={username} />
          <TextField label="Bio" multiline onChangeText={setBio} value={bio} />
          <GradientButton loading={saving} onPress={handleSave}>
            Guardar perfil local
          </GradientButton>
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Modo local-first</Text>
        <Text style={styles.bio}>
          Los audios, videos e imágenes capturados desde móvil viven localmente en este
          dispositivo. No se suben a Supabase ni a ningún backend para poder trabajar liviano y
          sin inflar costos de storage.
        </Text>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Perfil Público Opcional — ✦ PRONTO</Text>
        <Text style={styles.bio}>
          La vitrina pública queda congelada por ahora. La prioridad total es pulir Quick Capture,
          el documento multimedia y la experiencia tablet-first.
        </Text>
      </GlassCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  bio: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontUiMedium,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
  },
  form: {
    gap: 14,
    marginTop: 16,
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
    fontFamily: creatorTheme.fontMono,
    fontSize: 13,
  },
  profileName: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 20,
  },
  sectionTitle: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 24,
  },
});
