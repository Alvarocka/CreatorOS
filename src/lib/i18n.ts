import type {
  CreativeItemType,
  Visibility,
  WorkflowStatus
} from "@/lib/types/app";

export const appLocales = ["es", "en"] as const;

export type AppLocale = (typeof appLocales)[number];

export const DEFAULT_LOCALE: AppLocale = "es";
export const LANGUAGE_COOKIE = "creatoros-locale";

export function normalizeLocale(value?: string | null): AppLocale {
  return value === "en" ? "en" : DEFAULT_LOCALE;
}

const dictionaries = {
  es: {
    localeName: "Español",
    nav: {
      dashboard: "Dashboard",
      library: "Biblioteca",
      projects: "Proyectos",
      search: "Buscar",
      settings: "Ajustes"
    },
    shell: {
      brandCopy: "Tu hub creativo vivo",
      banner: "Todo tu caos creativo en un solo lugar",
      searchPlaceholder: "Buscar...",
      publicProfileBadge: "Perfil público opcional",
      publicProfileBody:
        "Marca piezas o proyectos como públicos para mostrar tu trabajo sin sacar nada de contexto.",
      publicProfileCta: "Muestra tus ideas al mundo"
    },
    common: {
      newPiece: "Nueva pieza",
      quickCapture: "Captura rápida",
      noProject: "Sin proyecto",
      shareable: "Compartible",
      favorite: "Favorito",
      save: "Guardar",
      saving: "Guardando...",
      logout: "Cerrar sesión",
      language: "Idioma",
      spanish: "Español",
      english: "Inglés"
    },
    dashboard: {
      eyebrow: "Dashboard",
      title: "Hola",
      description:
        "Tu central creativa para verlo todo de un vistazo y volver a crear sin perder el hilo.",
      metrics: {
        recent: { label: "Recientes", description: "Cosas frescas" },
        favorites: { label: "Favoritos", description: "Tus elegidos" },
        uncategorized: { label: "Sin clasificar", description: "Cosas sueltas" },
        activeProjects: { label: "Proyectos activos", description: "Proyectos en marcha" }
      },
      viewProjects: "Ver Proyectos",
      captureIdea: "Captura una idea",
      recentTitle: "Piezas recientes",
      recentDescription: "Tu material vivo para retomar el hilo sin buscar demasiado.",
      readyTitle: "Listo para publicar",
      readyDescription: "Cuando algo ya tiene forma suficiente para salir al mundo.",
      favoritesTitle: "Favoritos",
      favoritesDescription: "Tus piezas marcadas para volver rápido.",
      projectsTitle: "Proyectos activos",
      projectsDescription: "Los contenedores donde tus ideas empiezan a convertirse en obra.",
      emptyRecentTitle: "Nada por aqui aun...",
      emptyRecentDescription: "Empieza a crear y llena tu galeria.",
      emptyRecentAction: "Crear algo nuevo",
      emptyReadyTitle: "Listo para brillar",
      emptyReadyDescription: "Cuando algo este listo para salir, aparecera aqui.",
      emptyReadyAction: "Ir a Biblioteca",
      emptyFavoritesTitle: "Todavia no marcaste favoritos",
      emptyFavoritesDescription:
        "Marca como favorito aquello que quieras volver a abrir seguido.",
      emptyProjectsTitle: "Todavia no hay proyectos",
      emptyProjectsDescription:
        "Crea un proyecto para juntar piezas, referencias y trabajo vivo en un mismo lugar.",
      emptyProjectsAction: "Crear proyecto"
    },
    settings: {
      eyebrow: "Settings",
      title: "Configuracion",
      description:
        "Ajusta tu identidad publica, la experiencia del workspace y el idioma principal.",
      publicUrlTitle: "URL publica",
      publicUrlBadge: "Perfil publico",
      publicUrlBody: "Tu vitrina publica vive en",
      publicUrlHint: "Solo apareceran las piezas y proyectos marcados como publicos.",
      sessionTitle: "Sesion",
      sessionBody:
        "Tu sesion se mantiene persistente gracias a Supabase Auth y al middleware SSR de Next.js.",
      languageTitle: "Idioma del workspace",
      languageBody:
        "Elige entre espanol e ingles. El cambio se aplica al shell, dashboard y vistas principales."
    },
    profile: {
      title: "Perfil y vitrina publica",
      description: "Configura tu identidad creativa y la URL publica de tu perfil.",
      displayName: "Nombre visible",
      username: "Username",
      bio: "Bio",
      avatarUrl: "Avatar URL",
      bioPlaceholder: "Que haces, que exploras y que quieres mostrar publicamente.",
      avatarPlaceholder: "https://...",
      save: "Guardar perfil",
      saving: "Guardando..."
    },
    library: {
      eyebrow: "Biblioteca",
      title: "Biblioteca creativa",
      description:
        "Tu archivo completo: texto, notas, audios, imagenes, videos, archivos y links organizados en un solo flujo."
    },
    projects: {
      eyebrow: "Proyectos",
      title: "Tus proyectos",
      description:
        "Agrupa piezas por trabajo, serie, lanzamiento, libro, album o cualquier ciclo creativo.",
      highlightTitle: "Biblioteca de proyectos",
      highlightBody:
        "Cada proyecto puede vivir en privado o en publico y contener piezas filtrables por tipo y estado.",
      emptyTitle: "Todavia no hay proyectos",
      emptyDescription:
        "Tu primer proyecto puede ser un album, una campana, un libro o simplemente un contenedor para que tus ideas no sigan aisladas."
    },
    search: {
      eyebrow: "Busqueda global",
      title: "Buscar en CreatorOS",
      description:
        "Encuentra piezas por titulo, descripcion, texto, tags, proyecto, tipo, estado o visibilidad.",
      placeholder: "Ej: demo coro, campana otono, hook, referencia visual"
    },
    labels: {
      status: {
        idea: "Idea",
        draft: "Borrador",
        in_progress: "En progreso",
        review: "Revision",
        ready: "Listo",
        published: "Publicado",
        archived: "Archivado"
      },
      visibility: {
        private: "Privado",
        public: "Publico"
      },
      type: {
        text: "Texto",
        audio: "Audio",
        image: "Imagen",
        video: "Video",
        file: "Archivo",
        link: "Link",
        note: "Nota"
      }
    }
  },
  en: {
    localeName: "English",
    nav: {
      dashboard: "Dashboard",
      library: "Library",
      projects: "Projects",
      search: "Search",
      settings: "Settings"
    },
    shell: {
      brandCopy: "Your living creative hub",
      banner: "All your creative chaos in one place",
      searchPlaceholder: "Search...",
      publicProfileBadge: "Optional public profile",
      publicProfileBody:
        "Mark pieces or projects as public to share your work without losing context.",
      publicProfileCta: "Show your ideas to the world"
    },
    common: {
      newPiece: "New piece",
      quickCapture: "Quick capture",
      noProject: "No project",
      shareable: "Shareable",
      favorite: "Favorite",
      save: "Save",
      saving: "Saving...",
      logout: "Log out",
      language: "Language",
      spanish: "Spanish",
      english: "English"
    },
    dashboard: {
      eyebrow: "Dashboard",
      title: "Hi",
      description:
        "Your creative command center to see everything at a glance and get back to making without losing momentum.",
      metrics: {
        recent: { label: "Recent", description: "Fresh pieces" },
        favorites: { label: "Favorites", description: "Your picks" },
        uncategorized: { label: "Unsorted", description: "Loose ideas" },
        activeProjects: { label: "Active projects", description: "Work in motion" }
      },
      viewProjects: "View Projects",
      captureIdea: "Capture an idea",
      recentTitle: "Recent pieces",
      recentDescription: "Your live material to jump back in without digging around.",
      readyTitle: "Ready to publish",
      readyDescription: "Anything with enough shape to go live soon.",
      favoritesTitle: "Favorites",
      favoritesDescription: "Your marked pieces for quick return.",
      projectsTitle: "Active projects",
      projectsDescription: "The containers where ideas start becoming finished work.",
      emptyRecentTitle: "Nothing here yet...",
      emptyRecentDescription: "Start creating and fill your gallery.",
      emptyRecentAction: "Create something new",
      emptyReadyTitle: "Ready to shine",
      emptyReadyDescription: "When something is ready to launch, it will show up here.",
      emptyReadyAction: "Go to Library",
      emptyFavoritesTitle: "No favorites yet",
      emptyFavoritesDescription: "Mark anything you want to reopen often as a favorite.",
      emptyProjectsTitle: "No projects yet",
      emptyProjectsDescription:
        "Create a project to gather pieces, references and live work in one place.",
      emptyProjectsAction: "Create project"
    },
    settings: {
      eyebrow: "Settings",
      title: "Settings",
      description:
        "Adjust your public identity, workspace experience and the primary language of the app.",
      publicUrlTitle: "Public URL",
      publicUrlBadge: "Public profile",
      publicUrlBody: "Your public showcase lives at",
      publicUrlHint: "Only items and projects marked as public will appear there.",
      sessionTitle: "Session",
      sessionBody:
        "Your session stays persistent thanks to Supabase Auth and the Next.js SSR middleware.",
      languageTitle: "Workspace language",
      languageBody:
        "Choose between Spanish and English. The change applies to the shell, dashboard and core views."
    },
    profile: {
      title: "Profile and public showcase",
      description: "Set your creative identity and public profile URL.",
      displayName: "Display name",
      username: "Username",
      bio: "Bio",
      avatarUrl: "Avatar URL",
      bioPlaceholder: "What do you make, explore and want to show publicly?",
      avatarPlaceholder: "https://...",
      save: "Save profile",
      saving: "Saving..."
    },
    library: {
      eyebrow: "Library",
      title: "Creative library",
      description:
        "Your full archive: text, notes, audio, images, videos, files and links organized in one flow."
    },
    projects: {
      eyebrow: "Projects",
      title: "Your projects",
      description:
        "Group pieces by work, series, launch, book, album or any creative cycle you want to track.",
      highlightTitle: "Project library",
      highlightBody:
        "Each project can live privately or publicly and contain filterable pieces by type and status.",
      emptyTitle: "No projects yet",
      emptyDescription:
        "Your first project can be an album, a campaign, a book or simply a container so your ideas stop living in isolation."
    },
    search: {
      eyebrow: "Global search",
      title: "Search in CreatorOS",
      description:
        "Find pieces by title, description, text, tags, project, type, status or visibility.",
      placeholder: "Ex: chorus demo, fall campaign, hook, visual reference"
    },
    labels: {
      status: {
        idea: "Idea",
        draft: "Draft",
        in_progress: "In progress",
        review: "Review",
        ready: "Ready",
        published: "Published",
        archived: "Archived"
      },
      visibility: {
        private: "Private",
        public: "Public"
      },
      type: {
        text: "Text",
        audio: "Audio",
        image: "Image",
        video: "Video",
        file: "File",
        link: "Link",
        note: "Note"
      }
    }
  }
} as const;

export type AppDictionary = (typeof dictionaries)[AppLocale];

export function getDictionary(locale: AppLocale) {
  return dictionaries[locale];
}

export function getGreeting(locale: AppLocale, name?: string | null) {
  const base = dictionaries[locale].dashboard.title;
  return name ? `${base}, ${name}!` : `${base}!`;
}

export function getStatusLabel(locale: AppLocale, status: WorkflowStatus) {
  return dictionaries[locale].labels.status[status];
}

export function getVisibilityLabel(locale: AppLocale, visibility: Visibility) {
  return dictionaries[locale].labels.visibility[visibility];
}

export function getTypeLabel(locale: AppLocale, type: CreativeItemType) {
  return dictionaries[locale].labels.type[type];
}
