import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { GlassCard } from '@/src/components/glass-card';
import { formatMediaSize } from '@/src/lib/studio-documents';
import { formatDocumentDate, getDocumentPreview } from '@/src/lib/studio-format';
import { creatorTheme } from '@/src/lib/theme';
import type { StudioDocument } from '@/src/types/app';

const mediaIconMap = {
  audio: 'mic',
  image: 'image',
  video: 'film',
} as const;

export function StudioDocumentCard({
  document,
  onPress,
}: {
  document: StudioDocument;
  onPress?: () => void;
}) {
  const mediaIcon =
    document.mediaType && mediaIconMap[document.mediaType]
      ? mediaIconMap[document.mediaType]
      : 'file-text';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Feather color="#FFFFFF" name={mediaIcon} size={16} />
          </View>
          <View style={styles.copy}>
            <Text numberOfLines={1} style={styles.title}>
              {document.title}
            </Text>
            <Text numberOfLines={1} style={styles.meta}>
              {formatDocumentDate(document.updatedAt)} · {document.mediaName || 'Documento de texto'} ·{' '}
              {formatMediaSize(document.mediaSizeBytes)}
            </Text>
          </View>
        </View>
        <Text numberOfLines={3} style={styles.preview}>
          {getDocumentPreview(document.noteText)}
        </Text>
        {document.tags.length ? (
          <View style={styles.tagsRow}>
            {document.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: creatorTheme.panelSoft,
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  card: {
    gap: 14,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  meta: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontMono,
    fontSize: 12,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  preview: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontBody,
    fontSize: 15,
    lineHeight: 23,
  },
  tag: {
    backgroundColor: 'rgba(232, 168, 76, 0.10)',
    borderColor: 'rgba(232, 168, 76, 0.32)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: creatorTheme.amber,
    fontFamily: creatorTheme.fontMono,
    fontSize: 11,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 17,
  },
});
