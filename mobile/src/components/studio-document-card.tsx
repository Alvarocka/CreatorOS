import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { GlassCard } from '@/src/components/glass-card';
import { formatMediaSize } from '@/src/lib/studio-documents';
import { creatorTheme } from '@/src/lib/theme';
import type { StudioDocument } from '@/src/types/app';

const mediaIconMap = {
  audio: 'mic',
  image: 'image',
  video: 'film',
} as const;

function getPreview(noteText: string) {
  const compact = noteText.replace(/\s+/g, ' ').trim();
  if (!compact) return 'Abre el documento y empieza a desarrollar la idea.';
  return compact.length > 96 ? `${compact.slice(0, 96)}...` : compact;
}

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
              {document.mediaName || 'Documento de texto'} ·{' '}
              {formatMediaSize(document.mediaSizeBytes)}
            </Text>
          </View>
        </View>
        <Text numberOfLines={3} style={styles.preview}>
          {getPreview(document.noteText)}
        </Text>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
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
    fontSize: 12,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  preview: {
    color: creatorTheme.text,
    fontSize: 15,
    lineHeight: 23,
  },
  title: {
    color: creatorTheme.text,
    fontSize: 17,
    fontWeight: '800',
  },
});
