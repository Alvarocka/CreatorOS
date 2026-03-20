import {
  Archive,
  BookOpen,
  Compass,
  FolderKanban,
  LayoutDashboard,
  Search
} from "lucide-react";

export const itemTypes = [
  "text",
  "audio",
  "image",
  "video",
  "file",
  "link",
  "note"
] as const;

export const workflowStatuses = [
  "idea",
  "draft",
  "in_progress",
  "review",
  "ready",
  "published",
  "archived"
] as const;

export const visibilityOptions = ["private", "public"] as const;

export const noteTypes = ["general", "mental", "reference", "lyric"] as const;

export const appNavigation = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/library", labelKey: "library", icon: BookOpen },
  { href: "/projects", labelKey: "projects", icon: FolderKanban },
  { href: "/search", labelKey: "search", icon: Search },
  { href: "/settings", labelKey: "settings", icon: Compass }
] as const;

export const dashboardCollections = [
  { key: "recent", label: "Recientes" },
  { key: "favorites", label: "Favoritos" },
  { key: "uncategorized", label: "Sin clasificar" },
  { key: "ready", label: "Listo para publicar" }
] as const;

export const libraryViewModes = ["grid", "list"] as const;

export const publicEntityTypes = ["item", "project"] as const;

export const emptyStates = {
  library: {
    title: "Tu biblioteca todavía está esperando su primera pieza",
    description:
      "Empieza capturando una idea, un link, un audio o un archivo. Todo vive aquí y luego se transforma."
  },
  projects: {
    title: "Todavía no hay proyectos activos",
    description:
      "Agrupa tus piezas por álbum, campaña, libro, video o cualquier proceso creativo que quieras seguir."
  },
  notes: {
    title: "Todavía no hay notas de trabajo",
    description:
      "Usa este espacio para dejar ideas, observaciones, letras, instrucciones o recordatorios con o sin timestamp."
  }
} as const;

export const mediaAcceptMap: Record<(typeof itemTypes)[number], string> = {
  text: "",
  audio: "audio/*",
  image: "image/*",
  video: "video/*",
  file:
    ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.csv,.psd,.ai,.fig,.sketch",
  link: "",
  note: ""
};

export const archiveHint =
  "CreatorOS ordena el caos creativo para que tus ideas no vuelvan a perderse.";

export const statusLabelMap: Record<(typeof workflowStatuses)[number], string> = {
  idea: "Idea",
  draft: "Borrador",
  in_progress: "En progreso",
  review: "Revisión",
  ready: "Listo",
  published: "Publicado",
  archived: "Archivado"
};

export const visibilityLabelMap: Record<(typeof visibilityOptions)[number], string> = {
  private: "Privado",
  public: "Público"
};

export const noteTypeLabelMap: Record<(typeof noteTypes)[number], string> = {
  general: "General",
  mental: "Nota mental",
  reference: "Referencia",
  lyric: "Letra"
};

export const typeLabelMap: Record<(typeof itemTypes)[number], string> = {
  text: "Texto",
  audio: "Audio",
  image: "Imagen",
  video: "Video",
  file: "Archivo",
  link: "Link",
  note: "Nota"
};

export const studioPillStyles = [
  "bg-studio-sand text-studio-ink",
  "bg-studio-terracotta/10 text-studio-terracotta",
  "bg-studio-teal/10 text-studio-teal",
  "bg-studio-moss/10 text-studio-moss"
];

export const librarySortOptions = [
  { value: "updated_desc", label: "Más reciente" },
  { value: "updated_asc", label: "Más antiguo" },
  { value: "title_asc", label: "A-Z" },
  { value: "title_desc", label: "Z-A" }
] as const;

export const archiveSections = [
  {
    icon: Archive,
    title: "Archivo vivo",
    description: "Todo el material creativo convive, se ordena y vuelve a tener contexto."
  }
] as const;
