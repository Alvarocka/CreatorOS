import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { GlassCard } from '@/src/components/glass-card';
import { relativeTime } from '@/src/lib/format';
import { creatorTheme } from '@/src/lib/theme';
import type { Project } from '@/src/types/app';

export function ProjectListItem({ project }: { project: Project }) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Feather color="#FFFFFF" name="folder" size={18} />
        </View>
        <View style={styles.copy}>
          <Text numberOfLines={1} style={styles.title}>
            {project.title}
          </Text>
          <Text numberOfLines={2} style={styles.description}>
            {project.description || 'Agrupa piezas, ideas y trabajo vivo en un mismo lugar.'}
          </Text>
        </View>
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>{relativeTime(project.updated_at)}</Text>
        <Text style={styles.metaText}>
          {project.visibility === 'public' ? 'Publico' : 'Privado'}
        </Text>
      </View>
    </GlassCard>
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
  description: {
    color: creatorTheme.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
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
  title: {
    color: creatorTheme.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
