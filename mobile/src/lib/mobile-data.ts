import { supabase } from '@/src/lib/supabase';
import type {
  CreativeItem,
  CreativeItemType,
  DashboardSnapshot,
  Project,
  Profile,
  Visibility,
  WorkflowStatus,
} from '@/src/types/app';

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return (data as Profile | null) || null;
}

export async function upsertProfileFromSignup(params: {
  userId: string;
  email: string;
  displayName?: string;
}) {
  const username = params.email
    ? params.email
        .split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .slice(0, 24)
    : `creator_${params.userId.slice(0, 8)}`;

  await supabase.from('profiles').upsert(
    {
      id: params.userId,
      display_name: params.displayName?.trim() || username,
      username,
    },
    { onConflict: 'id' }
  );
}

export async function fetchDashboardSnapshot(userId: string): Promise<DashboardSnapshot> {
  const [recentResult, favoritesResult, uncategorizedResult, readyResult, projectsResult] =
    await Promise.all([
      supabase
        .from('creative_items')
        .select('*')
        .eq('user_id', userId)
        .is('archived_at', null)
        .order('updated_at', { ascending: false })
        .limit(5),
      supabase
        .from('creative_items')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_favorite', true)
        .is('archived_at', null),
      supabase
        .from('creative_items')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .is('project_id', null)
        .is('archived_at', null),
      supabase
        .from('creative_items')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'ready')
        .is('archived_at', null),
      supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .neq('status', 'archived'),
    ]);

  return {
    activeProjectsCount: projectsResult.count || 0,
    favoriteCount: favoritesResult.count || 0,
    recentItems: (recentResult.data as CreativeItem[] | null) || [],
    recentItemsCount: ((recentResult.data as CreativeItem[] | null) || []).length,
    readyCount: readyResult.count || 0,
    uncategorizedCount: uncategorizedResult.count || 0,
  };
}

export async function fetchRecentLibraryItems(userId: string) {
  const { data, error } = await supabase
    .from('creative_items')
    .select('*')
    .eq('user_id', userId)
    .is('archived_at', null)
    .order('updated_at', { ascending: false })
    .limit(25);

  if (error) throw error;
  return (data as CreativeItem[]) || [];
}

export async function fetchProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .neq('status', 'archived')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data as Project[]) || [];
}

export async function createQuickItem(params: {
  userId: string;
  title: string;
  contentText?: string;
  description?: string;
  fileUrl?: string;
  type: CreativeItemType;
  visibility?: Visibility;
  status?: WorkflowStatus;
}) {
  const { data, error } = await supabase
    .from('creative_items')
    .insert({
      content_text: params.contentText?.trim() || null,
      description: params.description?.trim() || null,
      file_url: params.fileUrl?.trim() || null,
      is_favorite: false,
      status: params.status || 'idea',
      title: params.title.trim(),
      type: params.type,
      user_id: params.userId,
      visibility: params.visibility || 'private',
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as CreativeItem;
}
