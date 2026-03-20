import { redirect } from "next/navigation";

import type { User } from "@supabase/supabase-js";

import type {
  CreativeItem,
  CreativeItemTag,
  CreativeItemNote,
  CreativeItemWithRelations,
  DashboardData,
  LibraryFilters,
  Profile,
  Project,
  ProjectWithItems,
  PublicShare,
  Tag
} from "@/lib/types/app";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { workflowStatuses } from "@/lib/constants/creatoros";

const ASSET_BUCKET = "creative-assets";

const emptyDashboard: DashboardData = {
  profile: null,
  recentItems: [],
  favoriteItems: [],
  uncategorizedItems: [],
  readyItems: [],
  activeProjects: []
};

export async function getViewerContext() {
  const { isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return {
      isConfigured,
      profile: null as Profile | null,
      user: null as User | null
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isConfigured,
      profile: null as Profile | null,
      user: null as User | null
    };
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

  return {
    isConfigured,
    profile: (profile as Profile | null) || null,
    user
  };
}

export async function requireWorkspaceUser() {
  const viewer = await getViewerContext();

  if (!viewer.isConfigured) {
    return {
      ...viewer,
      profile: null,
      user: null
    };
  }

  if (!viewer.user) {
    redirect("/login");
  }

  return viewer as { isConfigured: true; user: User; profile: Profile | null };
}

async function resolveAssetUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const { isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.storage.from(ASSET_BUCKET).createSignedUrl(path, 60 * 60);
  return data?.signedUrl || null;
}

async function fetchProfilesMap(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, Profile>();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("profiles").select("*").in("id", userIds);
  const profiles = (data || []) as Profile[];
  return new Map(profiles.map((profile: Profile) => [profile.id, profile]));
}

async function fetchProjectsMap(projectIds: string[]) {
  if (projectIds.length === 0) return new Map<string, Project>();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("projects").select("*").in("id", projectIds);
  const projects = (data || []) as Project[];
  return new Map(projects.map((project: Project) => [project.id, project]));
}

async function fetchSharesMap(entityType: "item" | "project", entityIds: string[]) {
  if (entityIds.length === 0) return new Map<string, PublicShare>();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("public_shares")
    .select("*")
    .eq("entity_type", entityType)
    .in("entity_id", entityIds);
  const shares = (data || []) as PublicShare[];
  return new Map(shares.map((share: PublicShare) => [share.entity_id, share]));
}

async function hydrateItems(items: CreativeItem[]): Promise<CreativeItemWithRelations[]> {
  if (items.length === 0) return [];

  const supabase = await createServerSupabaseClient();
  const itemIds = items.map((item) => item.id);
  const projectIds = Array.from(new Set(items.map((item) => item.project_id).filter(Boolean))) as string[];

  const [projectsMap, itemShares, tagLinksResult] = await Promise.all([
    fetchProjectsMap(projectIds),
    fetchSharesMap("item", itemIds),
    supabase.from("creative_item_tags").select("*").in("creative_item_id", itemIds)
  ]);

  const tagLinks = (tagLinksResult.data || []) as CreativeItemTag[];
  const tagIds = Array.from(new Set(tagLinks.map((tag: CreativeItemTag) => tag.tag_id)));
  const { data: tagRows } = tagIds.length
    ? await supabase.from("tags").select("*").in("id", tagIds)
    : { data: [] as Tag[] };
  const resolvedTags = (tagRows || []) as Tag[];
  const tagsMap = new Map(resolvedTags.map((tag: Tag) => [tag.id, tag]));

  const tagsByItem = tagLinks.reduce(
    (acc, relation: CreativeItemTag) => {
      const tag = tagsMap.get(relation.tag_id);
      if (!tag) return acc;
      acc[relation.creative_item_id] ||= [];
      acc[relation.creative_item_id].push(tag);
      return acc;
    },
    {} as Record<string, Tag[]>
  );

  return items.map((item) => ({
    ...item,
    project: item.project_id ? projectsMap.get(item.project_id) || null : null,
    share: itemShares.get(item.id) || null,
    tags: tagsByItem[item.id] || []
  }));
}

function matchArchiveQuery(item: CreativeItemWithRelations, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    item.title,
    item.description,
    item.content_text,
    item.type,
    item.status,
    item.visibility,
    item.project?.title,
    ...(item.tags || []).map((tag) => tag.name)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

function sortItems(items: CreativeItemWithRelations[], sort: NonNullable<LibraryFilters["sort"]>) {
  return [...items].sort((a, b) => {
    switch (sort) {
      case "updated_asc":
        return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      case "title_asc":
        return a.title.localeCompare(b.title);
      case "title_desc":
        return b.title.localeCompare(a.title);
      case "updated_desc":
      default:
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });
}

export async function getDashboardData(): Promise<DashboardData> {
  const viewer = await requireWorkspaceUser();
  if (!viewer.user) return emptyDashboard;

  const supabase = await createServerSupabaseClient();

  const [
    recentResult,
    favoritesResult,
    uncategorizedResult,
    readyResult,
    projectsResult
  ] = await Promise.all([
    supabase
      .from("creative_items")
      .select("*")
      .eq("user_id", viewer.user.id)
      .is("archived_at", null)
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("creative_items")
      .select("*")
      .eq("user_id", viewer.user.id)
      .eq("is_favorite", true)
      .is("archived_at", null)
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("creative_items")
      .select("*")
      .eq("user_id", viewer.user.id)
      .is("project_id", null)
      .is("archived_at", null)
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("creative_items")
      .select("*")
      .eq("user_id", viewer.user.id)
      .eq("status", "ready")
      .is("archived_at", null)
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", viewer.user.id)
      .in("status", workflowStatuses.filter((status) => status !== "archived"))
      .order("updated_at", { ascending: false })
      .limit(4)
  ]);

  const [recentItems, favoriteItems, uncategorizedItems, readyItems] = await Promise.all([
    hydrateItems((recentResult.data || []) as CreativeItem[]),
    hydrateItems((favoritesResult.data || []) as CreativeItem[]),
    hydrateItems((uncategorizedResult.data || []) as CreativeItem[]),
    hydrateItems((readyResult.data || []) as CreativeItem[])
  ]);

  const activeProjects = await hydrateProjects((projectsResult.data || []) as Project[]);

  return {
    profile: viewer.profile,
    recentItems,
    favoriteItems,
    uncategorizedItems,
    readyItems,
    activeProjects
  };
}

export async function hydrateProjects(projects: Project[]): Promise<ProjectWithItems[]> {
  if (projects.length === 0) return [];

  const projectIds = projects.map((project) => project.id);
  const sharesMap = await fetchSharesMap("project", projectIds);

  return projects.map((project) => ({
    ...project,
    share: sharesMap.get(project.id) || null
  }));
}

export async function getLibraryData(filters: LibraryFilters) {
  const viewer = await requireWorkspaceUser();
  if (!viewer.user) {
    return {
      filters,
      items: [] as CreativeItemWithRelations[],
      projects: [] as Project[],
      tags: [] as Tag[]
    };
  }

  const supabase = await createServerSupabaseClient();
  let query = supabase.from("creative_items").select("*").eq("user_id", viewer.user.id);

  if (filters.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  } else {
    query = query.is("archived_at", null);
  }

  if (filters.visibility && filters.visibility !== "all") {
    query = query.eq("visibility", filters.visibility);
  }

  if (filters.favorite === "favorites") {
    query = query.eq("is_favorite", true);
  }

  if (filters.projectId && filters.projectId !== "all") {
    query = query.eq("project_id", filters.projectId);
  }

  if (filters.query?.trim()) {
    const term = filters.query.trim();
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%,content_text.ilike.%${term}%`);
  }

  query = query.order("updated_at", { ascending: false }).limit(100);

  const [{ data: itemsData }, { data: projects }, { data: tags }] = await Promise.all([
    query,
    supabase.from("projects").select("*").eq("user_id", viewer.user.id).order("updated_at", { ascending: false }),
    supabase.from("tags").select("*").eq("user_id", viewer.user.id).order("name", { ascending: true })
  ]);

  let items = await hydrateItems((itemsData || []) as CreativeItem[]);

  if (filters.tagId && filters.tagId !== "all") {
    items = items.filter((item) => item.tags?.some((tag) => tag.id === filters.tagId));
  }

  if (filters.query?.trim()) {
    items = items.filter((item) => matchArchiveQuery(item, filters.query!));
  }

  items = sortItems(items, filters.sort || "updated_desc");

  return {
    filters,
    items,
    projects: (projects || []) as Project[],
    tags: (tags || []) as Tag[]
  };
}

export async function getWorkspaceOptions() {
  const viewer = await requireWorkspaceUser();
  if (!viewer.user) {
    return {
      profile: viewer.profile,
      projects: [] as Project[],
      tags: [] as Tag[]
    };
  }

  const supabase = await createServerSupabaseClient();
  const [{ data: projects }, { data: tags }] = await Promise.all([
    supabase.from("projects").select("*").eq("user_id", viewer.user.id).order("updated_at", { ascending: false }),
    supabase.from("tags").select("*").eq("user_id", viewer.user.id).order("name", { ascending: true })
  ]);

  return {
    profile: viewer.profile,
    projects: (projects || []) as Project[],
    tags: (tags || []) as Tag[]
  };
}

export async function getProjectsPageData() {
  const viewer = await requireWorkspaceUser();
  if (!viewer.user) {
    return {
      profile: viewer.profile,
      projects: [] as ProjectWithItems[]
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", viewer.user.id)
    .order("updated_at", { ascending: false });

  return {
    profile: viewer.profile,
    projects: await hydrateProjects((projects || []) as Project[])
  };
}

export async function getItemById(id: string) {
  const viewer = await requireWorkspaceUser();
  if (!viewer.user) return null;

  const supabase = await createServerSupabaseClient();
  const [{ data: item }, { data: notes }] = await Promise.all([
    supabase.from("creative_items").select("*").eq("id", id).eq("user_id", viewer.user.id).maybeSingle(),
    supabase
      .from("creative_item_notes")
      .select("*")
      .eq("creative_item_id", id)
      .eq("user_id", viewer.user.id)
      .order("created_at", { ascending: false })
  ]);

  if (!item) return null;

  const [hydrated] = await hydrateItems([item as CreativeItem]);

  return {
    ...hydrated,
    notes: (notes || []) as CreativeItemNote[],
    resolved_file_url: await resolveAssetUrl(item.file_url)
  };
}

export async function getProjectById(id: string) {
  const viewer = await requireWorkspaceUser();
  if (!viewer.user) return null;

  const supabase = await createServerSupabaseClient();
  const [{ data: project }, { data: items }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).eq("user_id", viewer.user.id).maybeSingle(),
    supabase
      .from("creative_items")
      .select("*")
      .eq("project_id", id)
      .eq("user_id", viewer.user.id)
      .order("updated_at", { ascending: false })
  ]);

  if (!project) return null;

  const [hydratedProject] = await hydrateProjects([project as Project]);
  const hydratedItems = await hydrateItems((items || []) as CreativeItem[]);

  return {
    ...hydratedProject,
    items: hydratedItems
  };
}

export async function getSearchData(query: string) {
  return getLibraryData({
    favorite: "all",
    query,
    sort: "updated_desc",
    status: "all",
    tagId: "all",
    type: "all",
    view: "list",
    visibility: "all",
    projectId: "all"
  });
}

export async function getPublicProfileByUsername(username: string) {
  const { isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (!profile) return null;

  const [{ data: items }, { data: projects }] = await Promise.all([
    supabase
      .from("creative_items")
      .select("*")
      .eq("user_id", profile.id)
      .eq("visibility", "public")
      .is("archived_at", null)
      .order("updated_at", { ascending: false }),
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", profile.id)
      .eq("visibility", "public")
      .order("updated_at", { ascending: false })
  ]);

  return {
    profile,
    items: await hydrateItems((items || []) as CreativeItem[]),
    projects: await hydrateProjects((projects || []) as Project[])
  };
}

export async function getPublicItemBySlug(slug: string) {
  const { isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  const supabase = await createServerSupabaseClient();
  const { data: share } = await supabase
    .from("public_shares")
    .select("*")
    .eq("slug", slug)
    .eq("entity_type", "item")
    .maybeSingle();

  if (!share) return null;

  const { data: item } = await supabase
    .from("creative_items")
    .select("*")
    .eq("id", share.entity_id)
    .eq("visibility", "public")
    .maybeSingle();

  if (!item) return null;

  const [hydratedItem] = await hydrateItems([item as CreativeItem]);
  const authorMap = await fetchProfilesMap([item.user_id]);

  return {
    author: authorMap.get(item.user_id) || null,
    item: {
      ...hydratedItem,
      resolved_file_url: await resolveAssetUrl(item.file_url)
    }
  };
}

export async function getPublicProjectBySlug(slug: string) {
  const { isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  const supabase = await createServerSupabaseClient();
  const { data: share } = await supabase
    .from("public_shares")
    .select("*")
    .eq("slug", slug)
    .eq("entity_type", "project")
    .maybeSingle();

  if (!share) return null;

  const [{ data: project }, { data: items }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("id", share.entity_id)
      .eq("visibility", "public")
      .maybeSingle(),
    supabase
      .from("creative_items")
      .select("*")
      .eq("project_id", share.entity_id)
      .eq("visibility", "public")
      .is("archived_at", null)
      .order("updated_at", { ascending: false })
  ]);

  if (!project) return null;

  const [hydratedProject] = await hydrateProjects([project as Project]);
  const authorMap = await fetchProfilesMap([project.user_id]);

  return {
    author: authorMap.get(project.user_id) || null,
    project: {
      ...hydratedProject,
      items: await hydrateItems((items || []) as CreativeItem[])
    }
  };
}
