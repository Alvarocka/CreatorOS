import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as LegacyFileSystem from 'expo-file-system/legacy';

import {
  computeWaveformData,
  buildPlaceholderWaveform,
} from '@/src/lib/studio-waveform';
import { setStudioDebugCheckpoint } from '@/src/lib/studio-debug';
import {
  PICKABLE_MIME_TYPES,
  formatMediaSize,
  getFileExtension,
  inferMediaTypeFromAsset,
  inferMimeTypeFromName,
  validateStudioMediaDraft,
} from '@/src/lib/studio-validation';
import { parseTags } from '@/src/lib/studio-format';
import type {
  StudioDashboardSnapshot,
  StudioDocument,
  StudioMediaDraft,
} from '@/src/types/app';

const STUDIO_STORAGE_KEY_PREFIX = 'creatoros:studio-documents:';
const MEDIA_DIRECTORY = 'creatoros-media';

function storageKey(workspaceId: string) {
  return `${STUDIO_STORAGE_KEY_PREFIX}${workspaceId}`;
}

function createStudioDocumentId() {
  return `studio_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
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
  return fallback || 'Documento multimedia';
}

function sortDocuments(documents: StudioDocument[]) {
  return [...documents].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

async function getFileSize(uri: string) {
  const info = await LegacyFileSystem.getInfoAsync(uri);
  return 'size' in info && typeof info.size === 'number' ? info.size : null;
}

async function readDocuments(workspaceId: string) {
  const raw = await AsyncStorage.getItem(storageKey(workspaceId));
  if (!raw) return [] as StudioDocument[];

  try {
    const parsed = JSON.parse(raw) as StudioDocument[];
    return sortDocuments(parsed);
  } catch {
    return [];
  }
}

async function writeDocuments(workspaceId: string, documents: StudioDocument[]) {
  await AsyncStorage.setItem(storageKey(workspaceId), JSON.stringify(sortDocuments(documents)));
}

async function persistMediaDraft(workspaceId: string, documentId: string, draft: StudioMediaDraft) {
  validateStudioMediaDraft(draft);
  await setStudioDebugCheckpoint('persist-media:start', {
    documentId,
    mediaType: draft.mediaType,
    source: draft.source,
  });

  const extension =
    getFileExtension(draft.name) ||
    (draft.mediaType === 'audio' ? 'm4a' : draft.mediaType === 'video' ? 'mp4' : 'jpg');
  const safeName = sanitizeFileName(draft.name || `${draft.mediaType}-${documentId}.${extension}`);
  const baseDirectory = `${LegacyFileSystem.documentDirectory}${MEDIA_DIRECTORY}/${workspaceId}/${documentId}`;
  const destinationUri = `${baseDirectory}/${safeName}`;

  await LegacyFileSystem.makeDirectoryAsync(baseDirectory, { intermediates: true });

  const existingDestination = await LegacyFileSystem.getInfoAsync(destinationUri);
  if (existingDestination.exists) {
    await LegacyFileSystem.deleteAsync(destinationUri, { idempotent: true });
  }

  await LegacyFileSystem.copyAsync({
    from: draft.uri,
    to: destinationUri,
  });
  await setStudioDebugCheckpoint('persist-media:copied', {
    destinationUri,
    documentId,
  });

  const sizeBytes = draft.sizeBytes ?? (await getFileSize(destinationUri));
  const waveformData =
    draft.mediaType === 'audio'
      ? await computeWaveformData(destinationUri)
      : buildPlaceholderWaveform(24);
  await setStudioDebugCheckpoint('persist-media:waveform-ready', {
    documentId,
    mediaType: draft.mediaType,
  });

  return {
    ...draft,
    mimeType: draft.mimeType || inferMimeTypeFromName(draft.name),
    sizeBytes,
    uri: destinationUri,
    waveformData,
  };
}

async function removeMediaUri(uri: string | null) {
  if (!uri) return;

  const info = await LegacyFileSystem.getInfoAsync(uri);
  if (info.exists) {
    await LegacyFileSystem.deleteAsync(uri, { idempotent: true });
  }
}

export { formatMediaSize };

export async function pickStudioMedia() {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
    type: PICKABLE_MIME_TYPES,
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  const mediaType = inferMediaTypeFromAsset({
    mimeType: asset.mimeType || null,
    name: asset.name,
  });

  if (!mediaType) {
    throw new Error('Ese archivo no calza con los formatos permitidos de CreatorOS.');
  }

  const normalizedDraft: StudioMediaDraft = {
    mediaType,
    mimeType: asset.mimeType || inferMimeTypeFromName(asset.name),
    name: asset.name,
    sizeBytes: asset.size ?? (await getFileSize(asset.uri)),
    source: 'upload',
    uri: asset.uri,
  };

  validateStudioMediaDraft(normalizedDraft);
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

  validateStudioMediaDraft(draft);
  return draft;
}

export async function createStudioDocument(params: {
  description?: string;
  mediaDraft?: StudioMediaDraft | null;
  noteText?: string;
  tags?: string[] | string;
  title?: string;
  userId: string;
}) {
  const id = createStudioDocumentId();
  const now = new Date().toISOString();
  await setStudioDebugCheckpoint('create-document:start', {
    documentId: id,
    hasMedia: params.mediaDraft ? 'yes' : 'no',
    userId: params.userId,
  });
  const persistedMedia = params.mediaDraft
    ? await persistMediaDraft(params.userId, id, params.mediaDraft)
    : null;
  await setStudioDebugCheckpoint('create-document:media-ready', {
    documentId: id,
    mediaType: persistedMedia?.mediaType || 'text-only',
  });
  const normalizedTags = Array.isArray(params.tags) ? params.tags : parseTags(params.tags || '');

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
    tags: normalizedTags,
    title: normalizeTitle(params.title || '', persistedMedia?.name),
    updatedAt: now,
    userId: params.userId,
    waveformData: persistedMedia?.waveformData || [],
  };

  const existing = await readDocuments(params.userId);
  await writeDocuments(params.userId, [document, ...existing]);
  await setStudioDebugCheckpoint('create-document:stored', {
    documentId: id,
    mediaType: document.mediaType || 'text-only',
  });

  return document;
}

export async function fetchStudioDocuments(workspaceId: string) {
  return readDocuments(workspaceId);
}

export async function fetchStudioDocumentById(workspaceId: string, documentId: string) {
  const documents = await readDocuments(workspaceId);
  return documents.find((document) => document.id === documentId) || null;
}

export async function fetchStudioDashboardSnapshot(
  workspaceId: string
): Promise<StudioDashboardSnapshot> {
  const documents = await readDocuments(workspaceId);

  return {
    audioCount: documents.filter((document) => document.mediaType === 'audio').length,
    imageCount: documents.filter((document) => document.mediaType === 'image').length,
    recentDocuments: documents.slice(0, 6),
    totalCount: documents.length,
    videoCount: documents.filter((document) => document.mediaType === 'video').length,
  };
}

export async function updateStudioDocument(
  workspaceId: string,
  documentId: string,
  patch: Partial<Pick<StudioDocument, 'description' | 'noteText' | 'tags' | 'title' | 'waveformData'>>
) {
  const documents = await readDocuments(workspaceId);
  const nextDocuments = documents.map((document) => {
    if (document.id !== documentId) return document;

    return {
      ...document,
      description:
        patch.description !== undefined ? patch.description : document.description,
      noteText: patch.noteText !== undefined ? patch.noteText : document.noteText,
      tags: patch.tags !== undefined ? patch.tags : document.tags,
      title: patch.title !== undefined ? patch.title : document.title,
      updatedAt: new Date().toISOString(),
      waveformData: patch.waveformData !== undefined ? patch.waveformData : document.waveformData,
    };
  });

  await writeDocuments(workspaceId, nextDocuments);
  return nextDocuments.find((document) => document.id === documentId) || null;
}

export async function replaceStudioDocumentMedia(
  workspaceId: string,
  documentId: string,
  mediaDraft: StudioMediaDraft
) {
  const documents = await readDocuments(workspaceId);
  const currentDocument = documents.find((document) => document.id === documentId);

  if (!currentDocument) {
    throw new Error('No encontramos ese documento en este dispositivo.');
  }

  await removeMediaUri(currentDocument.mediaUri);
  const persistedMedia = await persistMediaDraft(workspaceId, documentId, mediaDraft);

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
      waveformData: persistedMedia.waveformData,
    };
  });

  await writeDocuments(workspaceId, nextDocuments);
  return nextDocuments.find((document) => document.id === documentId) || null;
}
