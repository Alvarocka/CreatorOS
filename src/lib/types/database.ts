export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      creative_items: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content_text: string | null;
          type: Database["public"]["Enums"]["creative_item_type"];
          file_url: string | null;
          thumbnail_url: string | null;
          description: string | null;
          project_id: string | null;
          status: Database["public"]["Enums"]["workflow_status"];
          visibility: Database["public"]["Enums"]["visibility_status"];
          is_favorite: boolean;
          archived_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content_text?: string | null;
          type: Database["public"]["Enums"]["creative_item_type"];
          file_url?: string | null;
          thumbnail_url?: string | null;
          description?: string | null;
          project_id?: string | null;
          status?: Database["public"]["Enums"]["workflow_status"];
          visibility?: Database["public"]["Enums"]["visibility_status"];
          is_favorite?: boolean;
          archived_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content_text?: string | null;
          type?: Database["public"]["Enums"]["creative_item_type"];
          file_url?: string | null;
          thumbnail_url?: string | null;
          description?: string | null;
          project_id?: string | null;
          status?: Database["public"]["Enums"]["workflow_status"];
          visibility?: Database["public"]["Enums"]["visibility_status"];
          is_favorite?: boolean;
          archived_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          cover_image_url: string | null;
          status: Database["public"]["Enums"]["workflow_status"];
          visibility: Database["public"]["Enums"]["visibility_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          cover_image_url?: string | null;
          status?: Database["public"]["Enums"]["workflow_status"];
          visibility?: Database["public"]["Enums"]["visibility_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          cover_image_url?: string | null;
          status?: Database["public"]["Enums"]["workflow_status"];
          visibility?: Database["public"]["Enums"]["visibility_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          color?: string | null;
        };
        Relationships: [];
      };
      creative_item_tags: {
        Row: {
          creative_item_id: string;
          tag_id: string;
        };
        Insert: {
          creative_item_id: string;
          tag_id: string;
        };
        Update: {
          creative_item_id?: string;
          tag_id?: string;
        };
        Relationships: [];
      };
      creative_item_notes: {
        Row: {
          id: string;
          creative_item_id: string;
          user_id: string;
          note_type: Database["public"]["Enums"]["creative_note_type"];
          content_text: string;
          timestamp_seconds: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creative_item_id: string;
          user_id: string;
          note_type?: Database["public"]["Enums"]["creative_note_type"];
          content_text: string;
          timestamp_seconds?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          note_type?: Database["public"]["Enums"]["creative_note_type"];
          content_text?: string;
          timestamp_seconds?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      public_shares: {
        Row: {
          id: string;
          user_id: string;
          entity_type: Database["public"]["Enums"]["public_entity_type"];
          entity_id: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entity_type: Database["public"]["Enums"]["public_entity_type"];
          entity_id: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          slug?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      creative_item_type: "text" | "audio" | "image" | "video" | "file" | "link" | "note";
      workflow_status:
        | "idea"
        | "draft"
        | "in_progress"
        | "review"
        | "ready"
        | "published"
        | "archived";
      visibility_status: "private" | "public";
      creative_note_type: "general" | "mental" | "reference" | "lyric";
      public_entity_type: "item" | "project";
    };
    CompositeTypes: Record<string, never>;
  };
}
