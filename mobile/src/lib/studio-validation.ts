import type { StudioMediaDraft, StudioMediaFilter, StudioMediaType } from '@/src/types/app';

const MEGABYTE = 1024 * 1024;

export const STUDIO_MEDIA_LIMITS: Record<StudioMediaType, number> = {
  audio: 50 * MEGABYTE,
  image: 20 * MEGABYTE,
  video: 200 * MEGABYTE,
};

export const ALLOWED_EXTENSIONS: Record<StudioMediaType, string[]> = {
  audio: ['aac', 'm4a', 'mp3', 'ogg'],
  image: ['heic', 'jpeg', 'jpg', 'png', 'webp'],
  video: ['mp4', 'webm'],
};

const BLOCKED_EXTENSIONS = {
  audio: ['aiff', 'flac', 'wav'],
  image: ['psd', 'raw', 'tif', 'tiff'],
  video: ['avi', 'mkv', 'mov'],
} as const;

const ALLOWED_MIME_TYPES: Record<StudioMediaType, string[]> = {
  audio: ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/x-m4a'],
  image: ['image/heic', 'image/jpeg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/webm'],
};

export const PICKABLE_MIME_TYPES = [
  ...ALLOWED_MIME_TYPES.audio,
  ...ALLOWED_MIME_TYPES.video,
  ...ALLOWED_MIME_TYPES.image,
];

export function getFileExtension(name: string) {
  const segments = name.toLowerCase().split('.');
  return segments.length > 1 ? segments.at(-1) || '' : '';
}

export function inferMimeTypeFromName(name: string) {
  const extension = getFileExtension(name);

  switch (extension) {
    case 'aac':
      return 'audio/aac';
    case 'heic':
      return 'image/heic';
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg';
    case 'm4a':
      return 'audio/x-m4a';
    case 'mp3':
      return 'audio/mpeg';
    case 'mp4':
      return 'video/mp4';
    case 'ogg':
      return 'audio/ogg';
    case 'png':
      return 'image/png';
    case 'webm':
      return 'video/webm';
    case 'webp':
      return 'image/webp';
    default:
      return null;
  }
}

export function inferMediaTypeFromAsset(asset: { mimeType: string | null; name: string }) {
  if (asset.mimeType?.startsWith('audio/')) return 'audio';
  if (asset.mimeType?.startsWith('video/')) return 'video';
  if (asset.mimeType?.startsWith('image/')) return 'image';

  const extension = getFileExtension(asset.name);

  if (ALLOWED_EXTENSIONS.audio.includes(extension)) return 'audio';
  if (ALLOWED_EXTENSIONS.video.includes(extension)) return 'video';
  if (ALLOWED_EXTENSIONS.image.includes(extension)) return 'image';

  if (BLOCKED_EXTENSIONS.audio.includes(extension as never)) return 'audio';
  if (BLOCKED_EXTENSIONS.video.includes(extension as never)) return 'video';
  if (BLOCKED_EXTENSIONS.image.includes(extension as never)) return 'image';

  return null;
}

export function validateStudioMediaDraft(draft: StudioMediaDraft) {
  const extension = getFileExtension(draft.name);
  const normalizedMimeType = draft.mimeType || inferMimeTypeFromName(draft.name);

  if (BLOCKED_EXTENSIONS.audio.includes(extension as never)) {
    throw new Error('Este formato es para DAWs. Exporta a MP3 o M4A primero.');
  }

  if (BLOCKED_EXTENSIONS.video.includes(extension as never)) {
    throw new Error('Convierte a MP4 o WebM para usar en CreatorOS.');
  }

  if (BLOCKED_EXTENSIONS.image.includes(extension as never)) {
    throw new Error('Exporta como JPG, PNG o WebP desde tu editor.');
  }

  if (!ALLOWED_EXTENSIONS[draft.mediaType].includes(extension)) {
    throw new Error('Ese archivo no corresponde a un formato permitido para CreatorOS.');
  }

  if (
    normalizedMimeType &&
    normalizedMimeType !== 'application/octet-stream' &&
    !ALLOWED_MIME_TYPES[draft.mediaType].includes(normalizedMimeType)
  ) {
    throw new Error('El tipo MIME del archivo no coincide con un formato permitido.');
  }

  if (draft.sizeBytes && draft.sizeBytes > STUDIO_MEDIA_LIMITS[draft.mediaType]) {
    throw new Error(
      draft.mediaType === 'audio'
        ? 'El audio supera el limite de 50 MB.'
        : draft.mediaType === 'video'
          ? 'El video supera el limite de 200 MB.'
          : 'La imagen supera el limite de 20 MB.'
    );
  }
}

export function matchesMediaFilter(
  filter: StudioMediaFilter,
  mediaType: StudioMediaType | null
) {
  if (filter === 'all') return true;
  if (filter === 'text-only') return mediaType === null;
  return mediaType === filter;
}

export function formatMediaSize(sizeBytes: number | null) {
  if (!sizeBytes) return 'sin peso detectado';
  if (sizeBytes >= MEGABYTE) return `${(sizeBytes / MEGABYTE).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
}
