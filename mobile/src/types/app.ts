export type WorkflowStatus =
  | 'idea'
  | 'draft'
  | 'in_progress'
  | 'review'
  | 'ready'
  | 'published'
  | 'archived';

export type Visibility = 'private' | 'public';

export type CreativeItemType = 'text' | 'audio' | 'image' | 'video' | 'file' | 'link' | 'note';

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CreativeItem = {
  id: string;
  user_id: string;
  title: string;
  content_text: string | null;
  type: CreativeItemType;
  file_url: string | null;
  thumbnail_url: string | null;
  description: string | null;
  project_id: string | null;
  status: WorkflowStatus;
  visibility: Visibility;
  is_favorite: boolean;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  status: WorkflowStatus;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
};

export type DashboardSnapshot = {
  activeProjectsCount: number;
  favoriteCount: number;
  recentItems: CreativeItem[];
  recentItemsCount: number;
  readyCount: number;
  uncategorizedCount: number;
};

export type StudioMediaType = 'audio' | 'image' | 'video';

export type StudioMediaSource = 'recorded' | 'upload';

export type StudioMediaDraft = {
  mediaType: StudioMediaType;
  mimeType: string | null;
  name: string;
  sizeBytes: number | null;
  source: StudioMediaSource;
  uri: string;
};

export type StudioDocument = {
  createdAt: string;
  description: string;
  id: string;
  mediaMimeType: string | null;
  mediaName: string | null;
  mediaSizeBytes: number | null;
  mediaSource: StudioMediaSource | null;
  mediaType: StudioMediaType | null;
  mediaUri: string | null;
  noteText: string;
  title: string;
  updatedAt: string;
  userId: string;
};

export type StudioDashboardSnapshot = {
  audioCount: number;
  imageCount: number;
  recentDocuments: StudioDocument[];
  totalCount: number;
  videoCount: number;
};
