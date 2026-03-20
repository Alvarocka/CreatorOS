import AsyncStorage from '@react-native-async-storage/async-storage';

const STUDIO_DEBUG_KEY = 'creatoros:studio-debug:last-checkpoint';

export type StudioDebugCheckpoint = {
  at: string;
  details?: Record<string, string>;
  step: string;
};

export async function setStudioDebugCheckpoint(
  step: string,
  details?: Record<string, string | null | undefined>
) {
  const normalizedDetails = details
    ? Object.fromEntries(
        Object.entries(details)
          .filter(([, value]) => value !== null && value !== undefined && value !== '')
          .map(([key, value]) => [key, String(value)])
      )
    : undefined;

  const checkpoint: StudioDebugCheckpoint = {
    at: new Date().toISOString(),
    details: normalizedDetails && Object.keys(normalizedDetails).length ? normalizedDetails : undefined,
    step,
  };

  await AsyncStorage.setItem(STUDIO_DEBUG_KEY, JSON.stringify(checkpoint));
  return checkpoint;
}

export async function getStudioDebugCheckpoint() {
  const raw = await AsyncStorage.getItem(STUDIO_DEBUG_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StudioDebugCheckpoint;
  } catch {
    return null;
  }
}
