import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { GlassCard } from '@/src/components/glass-card';
import { ScreenShell } from '@/src/components/screen-shell';
import { StudioDocumentCard } from '@/src/components/studio-document-card';
import { fetchStudioDocuments } from '@/src/lib/studio-documents';
import { creatorTheme } from '@/src/lib/theme';
import { useAuth } from '@/src/providers/auth-provider';
import type { StudioDocument } from '@/src/types/app';

export default function LibraryScreen() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<StudioDocument[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <ScreenShell
      heading="Biblioteca viva"
      onRefresh={load}
      refreshing={loading}
      subheading="Tus documentos multimedia locales, listos para reabrir un audio, marcar un segundo exacto o seguir una idea donde la dejaste.">
      <GlassCard>
        <Text style={styles.sectionTitle}>Documentos en este dispositivo</Text>
        <Text style={styles.sectionCopy}>
          Por ahora esta biblioteca prioriza material local para ahorrar storage remoto y darte
          acceso inmediato a archivos grandes sin subirlos.
        </Text>

        {loading ? (
          <ActivityIndicator color="#FFFFFF" style={{ marginTop: 18 }} />
        ) : documents.length ? (
          <View style={styles.list}>
            {documents.map((document) => (
              <StudioDocumentCard
                document={document}
                key={document.id}
                onPress={() => router.push(`/(app)/studio/${document.id}`)}
              />
            ))}
          </View>
        ) : (
          <Text style={styles.emptyCopy}>
            Todavia no hay documentos multimedia. Empieza desde Captura Rapida con un audio, video
            o imagen.
          </Text>
        )}
      </GlassCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  emptyCopy: {
    color: creatorTheme.textMuted,
    lineHeight: 22,
    marginTop: 18,
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
    fontSize: 24,
    fontWeight: '900',
  },
});
