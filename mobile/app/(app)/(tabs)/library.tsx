import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { FilterChip } from '@/src/components/filter-chip';
import { GlassCard } from '@/src/components/glass-card';
import { ScreenShell } from '@/src/components/screen-shell';
import { SearchInput } from '@/src/components/search-input';
import { StudioDocumentCard } from '@/src/components/studio-document-card';
import { fetchStudioDocuments } from '@/src/lib/studio-documents';
import { matchesMediaFilter } from '@/src/lib/studio-validation';
import { creatorTheme } from '@/src/lib/theme';
import { getDocumentPreview } from '@/src/lib/studio-format';
import { useAuth } from '@/src/providers/auth-provider';
import type { StudioDocument, StudioMediaFilter } from '@/src/types/app';

const FILTERS: { label: string; value: StudioMediaFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Audio', value: 'audio' },
  { label: 'Video', value: 'video' },
  { label: 'Image', value: 'image' },
  { label: 'Text-only', value: 'text-only' },
];

export default function LibraryScreen() {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const [documents, setDocuments] = useState<StudioDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [mediaFilter, setMediaFilter] = useState<StudioMediaFilter>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const nextDocuments = await fetchStudioDocuments(user.id);
      setDocuments(nextDocuments);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const tagPool = useMemo(() => {
    return Array.from(new Set(documents.flatMap((document) => document.tags))).sort();
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return documents.filter((document) => {
      if (!matchesMediaFilter(mediaFilter, document.mediaType)) return false;
      if (activeTag && !document.tags.includes(activeTag)) return false;

      if (!normalizedQuery) return true;

      const haystack = [
        document.title,
        document.description,
        document.mediaName || '',
        getDocumentPreview(document.noteText),
        document.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [activeTag, documents, mediaFilter, query]);

  const twoColumns = width >= 760;

  return (
    <ScreenShell
      heading="Document Library"
      onRefresh={load}
      refreshing={loading}
      subheading="Todo lo que guardaste vive aquí: títulos, primeras líneas, tipo de medio, fecha y tags listos para encontrar el hilo rápido.">
      <SearchInput
        onChangeText={setQuery}
        placeholder="Buscar por titulo, nota o tag..."
        value={query}
      />

      <View style={styles.filtersWrap}>
        {FILTERS.map((filter) => (
          <FilterChip
            active={mediaFilter === filter.value}
            key={filter.value}
            onPress={() => setMediaFilter(filter.value)}>
            {filter.label}
          </FilterChip>
        ))}
      </View>

      {tagPool.length ? (
        <View style={styles.filtersWrap}>
          {tagPool.map((tag) => (
            <FilterChip
              active={activeTag === tag}
              key={tag}
              onPress={() => setActiveTag((current) => (current === tag ? null : tag))}>
              #{tag}
            </FilterChip>
          ))}
        </View>
      ) : null}

      <GlassCard>
        <Text style={styles.sectionTitle}>Saved documents</Text>
        <Text style={styles.sectionCopy}>
          Archivo local-first, optimizado para reabrir audios, videos e imágenes sin depender del
          servidor.
        </Text>

        {loading ? (
          <ActivityIndicator color={creatorTheme.text} style={{ marginTop: 18 }} />
        ) : filteredDocuments.length ? (
          <View style={[styles.grid, twoColumns && styles.gridTablet]}>
            {filteredDocuments.map((document) => (
              <View key={document.id} style={[styles.cardWrap, twoColumns && styles.cardWrapTablet]}>
                <StudioDocumentCard
                  document={document}
                  onPress={() => router.push(`/(app)/studio/${document.id}`)}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nada por aquí aún</Text>
            <Text style={styles.emptyCopy}>
              Usa Quick Capture para crear tu primer documento multimedia o ajusta la búsqueda y
              los filtros.
            </Text>
          </View>
        )}
      </GlassCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    width: '100%',
  },
  cardWrapTablet: {
    width: '48.5%',
  },
  emptyCopy: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontUiMedium,
    lineHeight: 22,
    textAlign: 'center',
  },
  emptyState: {
    gap: 10,
    marginTop: 18,
  },
  emptyTitle: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 18,
    textAlign: 'center',
  },
  filtersWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  grid: {
    gap: 12,
    marginTop: 18,
  },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionCopy: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontUiMedium,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  sectionTitle: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 24,
  },
});
