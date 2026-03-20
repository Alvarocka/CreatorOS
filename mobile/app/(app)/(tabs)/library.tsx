import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { GlassCard } from '@/src/components/glass-card';
import { PieceListItem } from '@/src/components/piece-list-item';
import { ScreenShell } from '@/src/components/screen-shell';
import { fetchRecentLibraryItems } from '@/src/lib/mobile-data';
import { creatorTheme } from '@/src/lib/theme';
import { useAuth } from '@/src/providers/auth-provider';
import type { CreativeItem } from '@/src/types/app';

export default function LibraryScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<CreativeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const nextItems = await fetchRecentLibraryItems(user.id);
      setItems(nextItems);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScreenShell
      heading="Biblioteca"
      onRefresh={load}
      refreshing={loading}
      subheading="Tu archivo completo, listo para revisarlo rapido desde el telefono.">
      <GlassCard>
        <Text style={{ color: creatorTheme.text, fontSize: 24, fontWeight: '900' }}>
          Ultimas piezas
        </Text>
        <Text
          style={{
            color: creatorTheme.textMuted,
            fontSize: 14,
            lineHeight: 21,
            marginTop: 6,
          }}>
          En esta base inicial mostramos lo mas reciente para moverte rapido. Los filtros avanzados vienen en la siguiente iteracion movil.
        </Text>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" style={{ marginTop: 18 }} />
        ) : items.length ? (
          <View style={{ gap: 12, marginTop: 18 }}>
            {items.map((item) => (
              <PieceListItem item={item} key={item.id} />
            ))}
          </View>
        ) : (
          <Text style={{ color: creatorTheme.textMuted, marginTop: 18 }}>
            Todavia no hay piezas en tu biblioteca movil.
          </Text>
        )}
      </GlassCard>
    </ScreenShell>
  );
}
