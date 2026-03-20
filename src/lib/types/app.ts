import type { Database } from "@/lib/types/database";

export type WorkflowStatus = Database["public"]["Enums"]["workflow_status"];
export type Visibility = Database["public"]["Enums"]["visibility_status"];
export type CreativeItemType = Database["public"]["Enums"]["creative_item_type"];
export type CreativeNoteType = Database["public"]["Enums"]["creative_note_type"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type CreativeItem = Database["public"]["Tables"]["creative_items"]["Row"];
export type CreativeItemTag = Database["public"]["Tables"]["creative_item_tags"]["Row"];
export type CreativeItemNote = Database["public"]["Tables"]["creative_item_notes"]["Row"];
export type PublicShare = Database["public"]["Tables"]["public_shares"]["Row"];

export type CreativeItemWithRelations = CreativeItem & {
  project?: Project | null;
  tags?: Tag[];
  notes?: CreativeItemNote[];
  share?: PublicShare | null;
  resolved_file_url?: string | null;
};

export type ProjectWithItems = Project & {
  items?: CreativeItemWithRelations[];
  share?: PublicShare | null;
};

export type DashboardData = {
  profile: Profile | null;
  recentItems: CreativeItemWithRelations[];
  favoriteItems: CreativeItemWithRelations[];
  uncategorizedItems: CreativeItemWithRelations[];
  readyItems: CreativeItemWithRelations[];
  activeProjects: ProjectWithItems[];
};

export type LibraryFilters = {
  query?: string;
  type?: CreativeItemType | "all";
  status?: WorkflowStatus | "all";
  visibility?: Visibility | "all";
  favorite?: "all" | "favorites";
  projectId?: string | "all";
  tagId?: string | "all";
  sort?: "updated_desc" | "updated_asc" | "title_asc" | "title_desc";
  view?: "grid" | "list";
};
