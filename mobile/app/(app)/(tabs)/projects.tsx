import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { GlassCard } from '@/src/components/glass-card';
import { ProjectListItem } from '@/src/components/project-list-item';
import { ScreenShell } from '@/src/components/screen-shell';
import { fetchProjects } from '@/src/lib/mobile-data';
import { creatorTheme } from '@/src/lib/theme';
import { useAuth } from '@/src/providers/auth-provider';
import type { Project } from '@/src/types/app';

export default function ProjectsScreen() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const nextProjects = await fetchProjects(user.id);
      setProjects(nextProjects);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScreenShell
      heading="Proyectos"
      onRefresh={load}
      refreshing={loading}
      subheading="Tus contenedores creativos para no dejar piezas flotando sin contexto.">
      <GlassCard>
        <Text style={{ color: creatorTheme.text, fontSize: 24, fontWeight: '900' }}>
          Activos ahora
        </Text>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" style={{ marginTop: 18 }} />
        ) : projects.length ? (
          <View style={{ gap: 12, marginTop: 18 }}>
            {projects.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </View>
        ) : (
          <Text style={{ color: creatorTheme.textMuted, marginTop: 18 }}>
            Todavia no hay proyectos en esta cuenta.
          </Text>
        )}
      </GlassCard>
    </ScreenShell>
  );
}
