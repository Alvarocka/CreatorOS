import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { AvatarBadge } from '@/src/components/avatar-badge';
import { CompactStatPill } from '@/src/components/compact-stat-pill';
import { GlassCard } from '@/src/components/glass-card';
import { GradientButton } from '@/src/components/gradient-button';
import { ScreenShell } from '@/src/components/screen-shell';
import { StudioDocumentCard } from '@/src/components/studio-document-card';
import { fetchStudioDashboardSnapshot } from '@/src/lib/studio-documents';
import { creatorTheme } from '@/src/lib/theme';
import { useAuth } from '@/src/providers/auth-provider';
import type { StudioDashboardSnapshot } from '@/src/types/app';

const emptySnapshot: StudioDashboardSnapshot = {
  audioCount: 0,
  imageCount: 0,
  recentDocuments: [],
  totalCount: 0,
  videoCount: 0,
};

export default function HomeScreen() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<StudioDashboardSnapshot>(emptySnapshot);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const nextSnapshot = await fetchStudioDashboardSnapshot(user.id);
      setSnapshot(nextSnapshot);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  return (
    <ScreenShell
      heading={`Hola${profile?.display_name ? `, ${profile.display_name}` : ''}`}
      onRefresh={load}
      refreshing={loading}
      rightSlot={<AvatarBadge label={profile?.display_name || profile?.username || 'CreatorOS'} />}
      subheading="Tu estudio movil para capturar audio, imagen o video y desarrollar la idea mientras el material sigue vivo.">
      <GlassCard style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>CreatorOS para tablet y movil</Text>
        <Text style={styles.heroTitle}>Captura rapido. Reproduce abajo. Escribe encima.</Text>
        <Text style={styles.heroCopy}>
          Este flujo esta pensado para abrir un audio o video, tomar notas con timestamps y
          volver al momento exacto sin perderte en menus.
        </Text>
        <GradientButton
          onPress={() => router.push('/(app)/(tabs)/capture')}
          size="large"
          style={styles.heroButton}>
          CAPTURA RAPIDA
        </GradientButton>
      </GlassCard>

      <View style={styles.statsRow}>
        <CompactStatPill label="Docs" tone="neutral" value={snapshot.totalCount} />
        <CompactStatPill label="Audios" tone="audio" value={snapshot.audioCount} />
        <CompactStatPill label="Videos" tone="video" value={snapshot.videoCount} />
        <CompactStatPill label="Visuales" tone="visual" value={snapshot.imageCount} />
      </View>

      <GlassCard>
        <View style={styles.sectionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Documentos recientes</Text>
            <Text style={styles.sectionCopy}>
              Lo último que abriste para escribir, marcar y seguir desarrollando.
            </Text>
          </View>
          <GradientButton
            onPress={() => router.push('/(app)/(tabs)/library')}
            style={styles.secondaryButton}
            variant="ghost">
            Ver todos
          </GradientButton>
        </View>

        {loading ? (
          <ActivityIndicator color="#FFFFFF" style={{ marginTop: 18 }} />
        ) : snapshot.recentDocuments.length ? (
          <View style={styles.documentList}>
            {snapshot.recentDocuments.map((document) => (
              <StudioDocumentCard
                document={document}
                key={document.id}
                onPress={() => router.push(`/(app)/studio/${document.id}`)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Tu primer documento multimedia parte aqui</Text>
            <Text style={styles.emptyCopy}>
              Sube un audio o graba una idea, luego escribe la letra, notas mentales o marcas
              exactas mientras el player sigue abajo.
            </Text>
            <GradientButton onPress={() => router.push('/(app)/(tabs)/capture')}>
              Crear documento
            </GradientButton>
          </View>
        )}
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Perfil público opcional pronto</Text>
        <Text style={styles.sectionCopy}>
          La vitrina pública queda en pausa por ahora. En esta fase móvil el foco es capturar y
          desarrollar ideas multimedia sin fricción.
        </Text>
      </GlassCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  documentList: {
    gap: 12,
    marginTop: 18,
  },
  emptyCopy: {
    color: creatorTheme.textMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  emptyState: {
    gap: 12,
    marginTop: 18,
    paddingVertical: 10,
  },
  emptyTitle: {
    color: creatorTheme.text,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  heroButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  heroCard: {
    gap: 10,
  },
  heroCopy: {
    color: creatorTheme.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  heroEyebrow: {
    color: creatorTheme.orange,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: creatorTheme.text,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1.1,
    lineHeight: 34,
  },
  secondaryButton: {
    minWidth: 92,
  },
  sectionCopy: {
    color: creatorTheme.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  sectionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  sectionTitle: {
    color: creatorTheme.text,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
