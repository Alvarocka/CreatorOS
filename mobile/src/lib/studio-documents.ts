import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

import type {
  StudioDashboardSnapshot,
  StudioDocument,
  StudioMediaDraft,
  StudioMediaType,
} from '@/src/types/app';

const STUDIO_STORAGE_KEY_PREFIX = 'creatoros:studio-documents:';
const MEDIA_DIRECTORY = 'creatoros-media';
const MEGABYTE = 1024 * 1024;

const MEDIA_LIMITS: Record<StudioMediaType, number> = {
  audio: 25 * MEGABYTE,
  image: 12 * MEGABYTE,
  video: 80 * MEGABYTE,
};

const ALLOWED_MIME_TYPES = {
  audio: ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/x-m4a'],
  image: ['image/heic', 'image/jpeg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/webm'],
} as const;

const EXTENSION_TO_MEDIA_TYPE: Record<string, StudioMediaType> = {
  aac: 'audio',
  heic: 'image',
  jpeg: 'image',
  jpg: 'image',
  m4a: 'audio',
  mp3: 'audio',
  mp4: 'video',
  png: 'image',
  webm: 'video',
  webp: 'image',
};

function storageKey(userId: string) {
  return `${STUDIO_STORAGE_KEY_PREFIX}${userId}`;
}

function createStudioDocumentId() {
  return `studio_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function getFileExtension(name: string) {
  const segments = name.toLowerCase().split('.');
  return segments.length > 1 ? segments.at(-1) || '' : '';
}

function sanitizeFileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeTitle(title: string, fallbackName?: string | null) {
  const cleaned = title.trim();
  if (cleaned) return cleaned;

  const fallback = (fallbackName || '').replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim();
  return fallback || 'Documento rapido';
}

function sortDocuments(documents: StudioDocument[]) {
  return [...documents].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function inferMediaTypeFromName(name: string) {
  return EXTENSION_TO_MEDIA_TYPE[getFileExtension(name)] || null;
}

function inferMimeTypeFromName(name: string) {
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

function inferMediaType(draft: { mimeType: string | null; name: string }) {
  if (draft.mimeType?.startsWith('audio/')) return 'audio';
  if (draft.mimeType?.startsWith('video/')) return 'video';
  if (draft.mimeType?.startsWith('image/')) return 'image';
  return inferMediaTypeFromName(draft.name);
}

async function getFileSize(uri: string) {
  const info = await FileSystem.getInfoAsync(uri);
  return 'size' in info && typeof info.size === 'number' ? info.size : null;
}

async function readDocuments(userId: string) {
  const raw = await AsyncStorage.getItem(storageKey(userId));
  if (!raw) return [] as StudioDocument[];

  try {
    const parsed = JSON.parse(raw) as StudioDocument[];
    return sortDocuments(parsed);
  } catch {
    return [];
  }
}

async function writeDocuments(userId: string, documents: StudioDocument[]) {
  await AsyncStorage.setItem(storageKey(userId), JSON.stringify(sortDocuments(documents)));
}

function validateDraft(draft: StudioMediaDraft) {
  const inferredMediaType = inferMediaType(draft);
  if (!inferredMediaType || inferredMediaType !== draft.mediaType) {
    throw new Error('Ese archivo no corresponde a un audio, video o imagen permitida.');
  }

  const normalizedMimeType = draft.mimeType || inferMimeTypeFromName(draft.name);
  const allowedMimeTypes = ALLOWED_MIME_TYPES[draft.mediaType];

  if (normalizedMimeType && !allowedMimeTypes.includes(normalizedMimeType as never)) {
    throw new Error(
      draft.mediaType === 'audio'
        ? 'Aceptamos audio ligero en MP3, M4A o AAC. Formatos pesados como WAV no estan permitidos.'
        : draft.mediaType === 'video'
          ? 'Aceptamos video en MP4 o WebM. Formatos pesados como MOV no estan permitidos.'
          : 'Aceptamos imagen en JPG, PNG, WEBP o HEIC.'
    );
  }

  if (draft.sizeBytes && draft.sizeBytes > MEDIA_LIMITS[draft.mediaType]) {
    throw new Error(
      draft.mediaType === 'audio'
        ? 'El audio supera el limite movil de 25 MB.'
        : draft.mediaType === 'video'
          ? 'El video supera el limite movil de 80 MB.'
          : 'La imagen supera el limite movil de 12 MB.'
    );
  }
}

async function persistMediaDraft(userId: string, documentId: string, draft: StudioMediaDraft) {
  validateDraft(draft);

  const extension =
    getFileExtension(draft.name) ||
    (draft.mediaType === 'audio' ? 'm4a' : draft.mediaType === 'video' ? 'mp4' : 'jpg');

  const safeName = sanitizeFileName(draft.name || `${draft.mediaType}-${documentId}.${extension}`);
  const baseDirectory = `${FileSystem.documentDirectory}${MEDIA_DIRECTORY}/${userId}/${documentId}`;
  const destinationUri = `${baseDirectory}/${safeName}`;

  await FileSystem.makeDirectoryAsync(baseDirectory, { intermediates: true });

  const existingDestination = await FileSystem.getInfoAsync(destinationUri);
  if (existingDestination.exists) {
    await FileSystem.deleteAsync(destinationUri, { idempotent: true });
  }

  await FileSystem.copyAsync({
    from: draft.uri,
    to: destinationUri,
  });

  return {
    ...draft,
    mimeType: draft.mimeType || inferMimeTypeFromName(draft.name),
    sizeBytes: draft.sizeBytes ?? (await getFileSize(destinationUri)),
    uri: destinationUri,
  };
}

async function removeMediaUri(uri: string | null) {
  if (!uri) return;

  const info = await FileSystem.getInfoAsync(uri);
  if (info.exists) {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
}

export function formatMediaSize(sizeBytes: number | null) {
  if (!sizeBytes) return 'Sin peso detectado';
  if (sizeBytes >= MEGABYTE) return `${(sizeBytes / MEGABYTE).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
}

export async function pickStudioMedia() {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
    type: [
      ...ALLOWED_MIME_TYPES.audio,
      ...ALLOWED_MIME_TYPES.video,
      ...ALLOWED_MIME_TYPES.image,
    ],
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  const mediaType = inferMediaType({
    mimeType: asset.mimeType || null,
    name: asset.name,
  });

  if (!mediaType) {
    throw new Error('Ese archivo no calza con los formatos moviles permitidos.');
  }

  const normalizedDraft: StudioMediaDraft = {
    mediaType,
    mimeType: asset.mimeType || inferMimeTypeFromName(asset.name),
    name: asset.name,
    sizeBytes: asset.size ?? (await getFileSize(asset.uri)),
    source: 'upload',
    uri: asset.uri,
  };

  validateDraft(normalizedDraft);
  return normalizedDraft;
}

export async function createRecordedAudioDraft(uri: string) {
  const sizeBytes = await getFileSize(uri);
  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, '0')}${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const draft: StudioMediaDraft = {
    mediaType: 'audio',
    mimeType: 'audio/x-m4a',
    name: `grabacion-${timestamp}.m4a`,
    sizeBytes,
    source: 'recorded',
    uri,
  };

  validateDraft(draft);
  return draft;
}

export async function createStudioDocument(params: {
  description?: string;
  mediaDraft?: StudioMediaDraft | null;
  noteText?: string;
  title?: string;
  userId: string;
}) {
  const id = createStudioDocumentId();
  const now = new Date().toISOString();
  const persistedMedia = params.mediaDraft
    ? await persistMediaDraft(params.userId, id, params.mediaDraft)
    : null;

  const document: StudioDocument = {
    createdAt: now,
    description: params.description?.trim() || '',
    id,
    mediaMimeType: persistedMedia?.mimeType || null,
    mediaName: persistedMedia?.name || null,
    mediaSizeBytes: persistedMedia?.sizeBytes || null,
    mediaSource: persistedMedia?.source || null,
    mediaType: persistedMedia?.mediaType || null,
    mediaUri: persistedMedia?.uri || null,
    noteText: params.noteText || '',
    title: normalizeTitle(params.title || '', persistedMedia?.name),
    updatedAt: now,
    userId: params.userId,
  };

  const existing = await readDocuments(params.userId);
  await writeDocuments(params.userId, [document, ...existing]);

  return document;
}

export async function fetchStudioDocuments(userId: string) {
  return readDocuments(userId);
}

export async function fetchStudioDocumentById(userId: string, documentId: string) {
  const documents = await readDocuments(userId);
  return documents.find((document) => document.id === documentId) || null;
}

export async function fetchStudioDashboardSnapshot(
  userId: string
): Promise<StudioDashboardSnapshot> {
  const documents = await readDocuments(userId);

  return {
    audioCount: documents.filter((document) => document.mediaType === 'audio').length,
    imageCount: documents.filter((document) => document.mediaType === 'image').length,
    recentDocuments: documents.slice(0, 5),
    totalCount: documents.length,
    videoCount: documents.filter((document) => document.mediaType === 'video').length,
  };
}

export async function updateStudioDocument(
  userId: string,
  documentId: string,
  patch: Partial<Pick<StudioDocument, 'description' | 'noteText' | 'title'>>
) {
  const documents = await readDocuments(userId);
  const nextDocuments = documents.map((document) => {
    if (document.id !== documentId) return document;

    return {
      ...document,
      description:
        patch.description !== undefined ? patch.description : document.description,
      noteText: patch.noteText !== undefined ? patch.noteText : document.noteText,
      title: patch.title !== undefined ? patch.title : document.title,
      updatedAt: new Date().toISOString(),
    };
  });

  await writeDocuments(userId, nextDocuments);
  return nextDocuments.find((document) => document.id === documentId) || null;
}

export async function replaceStudioDocumentMedia(
  userId: string,
  documentId: string,
  mediaDraft: StudioMediaDraft
) {
  const documents = await readDocuments(userId);
  const currentDocument = documents.find((document) => document.id === documentId);

  if (!currentDocument) {
    throw new Error('No encontramos ese documento en este dispositivo.');
  }

  await removeMediaUri(currentDocument.mediaUri);
  const persistedMedia = await persistMediaDraft(userId, documentId, mediaDraft);

  const nextDocuments = documents.map((document) => {
    if (document.id !== documentId) return document;

    return {
      ...document,
      mediaMimeType: persistedMedia.mimeType,
      mediaName: persistedMedia.name,
      mediaSizeBytes: persistedMedia.sizeBytes,
      mediaSource: persistedMedia.source,
      mediaType: persistedMedia.mediaType,
      mediaUri: persistedMedia.uri,
      updatedAt: new Date().toISOString(),
    };
  });

  await writeDocuments(userId, nextDocuments);
  return nextDocuments.find((document) => document.id === documentId) || null;
}
