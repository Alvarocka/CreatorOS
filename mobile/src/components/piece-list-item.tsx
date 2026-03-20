import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { GlassCard } from '@/src/components/glass-card';
import { relativeTime } from '@/src/lib/format';
import { creatorTheme } from '@/src/lib/theme';
import type { CreativeItem } from '@/src/types/app';

const typeIcons: Record<CreativeItem['type'], keyof typeof Feather.glyphMap> = {
  audio: 'mic',
  file: 'file-text',
  image: 'image',
  link: 'link',
  note: 'edit-3',
  text: 'type',
  video: 'video',
};

export function PieceListItem({
  item,
  onPress,
}: {
  item: CreativeItem;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <GlassCard style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Feather color="#FFFFFF" name={typeIcons[item.type]} size={18} />
          </View>
          <View style={styles.copy}>
            <Text numberOfLines={1} style={styles.title}>
              {item.title}
            </Text>
            <Text numberOfLines={2} style={styles.subtitle}>
              {item.description || item.content_text || 'Sin descripcion todavia.'}
            </Text>
          </View>
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{relativeTime(item.updated_at)}</Text>
          <Text style={styles.metaText}>
            {item.visibility === 'public' ? 'Publico' : 'Privado'}
          </Text>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: creatorTheme.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    color: creatorTheme.textMuted,
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  subtitle: {
    color: creatorTheme.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  title: {
    color: creatorTheme.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
