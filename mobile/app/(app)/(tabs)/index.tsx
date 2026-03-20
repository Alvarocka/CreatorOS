import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { GlassCard } from '@/src/components/glass-card';
import { GradientButton } from '@/src/components/gradient-button';
import { PieceListItem } from '@/src/components/piece-list-item';
import { ScreenShell } from '@/src/components/screen-shell';
import { StatCard } from '@/src/components/stat-card';
import { AvatarBadge } from '@/src/components/avatar-badge';
import { fetchDashboardSnapshot } from '@/src/lib/mobile-data';
import { creatorTheme } from '@/src/lib/theme';
import { useAuth } from '@/src/providers/auth-provider';
import type { DashboardSnapshot } from '@/src/types/app';

const emptySnapshot: DashboardSnapshot = {
  activeProjectsCount: 0,
  favoriteCount: 0,
  recentItems: [],
  recentItemsCount: 0,
  readyCount: 0,
  uncategorizedCount: 0,
};

export default function HomeScreen() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(emptySnapshot);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const nextSnapshot = await fetchDashboardSnapshot(user.id);
      setSnapshot(nextSnapshot);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScreenShell
      heading={`Hola${profile?.display_name ? `, ${profile.display_name}` : ''}`}
      onRefresh={load}
      refreshing={loading}
      rightSlot={<AvatarBadge label={profile?.display_name || profile?.username || 'CreatorOS'} />}
      subheading="Tu version nativa para capturar ideas rapido, revisar piezas recientes y volver a crear desde cualquier lugar.">
      <View style={styles.statsGrid}>
        <StatCard
          description="Lo ultimo que tocaste"
          label="Recientes"
          tone="blue"
          value={snapshot.recentItemsCount}
        />
        <StatCard
          description="Lo importante"
          label="Favoritos"
          tone="pink"
          value={snapshot.favoriteCount}
        />
        <StatCard
          description="Sin proyecto"
          label="Sueltas"
          tone="orange"
          value={snapshot.uncategorizedCount}
        />
        <StatCard
          description="Trabajo vivo"
          label="Proyectos"
          tone="green"
          value={snapshot.activeProjectsCount}
        />
      </View>

      <View style={styles.buttonRow}>
        <GradientButton onPress={() => router.push('/(app)/(tabs)/projects')} variant="info">
          Ver proyectos
        </GradientButton>
        <GradientButton onPress={() => router.push('/(app)/(tabs)/capture')}>
          Captura una idea
        </GradientButton>
      </View>

      <GlassCard>
        <Text style={styles.sectionTitle}>Piezas recientes</Text>
        <Text style={styles.sectionCopy}>
          Tu material vivo para retomar el hilo sin perder el momento.
        </Text>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" style={{ marginTop: 18 }} />
        ) : snapshot.recentItems.length ? (
          <View style={styles.list}>
            {snapshot.recentItems.map((item) => (
              <PieceListItem item={item} key={item.id} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nada por aqui aun...</Text>
            <Text style={styles.emptyCopy}>
              Empieza con una nota, un texto o un link y CreatorOS lo deja vivo para despues.
            </Text>
          </View>
        )}
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Listo para publicar</Text>
        <Text style={styles.sectionCopy}>
          Hoy tienes {snapshot.readyCount} pieza(s) en estado ready.
        </Text>
      </GlassCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    gap: 12,
  },
  emptyCopy: {
    color: creatorTheme.textMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  emptyState: {
    gap: 8,
    marginTop: 18,
    paddingVertical: 14,
  },
  emptyTitle: {
    color: creatorTheme.text,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  list: {
    gap: 12,
    marginTop: 18,
  },
  sectionCopy: {
    color: creatorTheme.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  sectionTitle: {
    color: creatorTheme.text,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  statsGrid: {
    gap: 14,
  },
});
