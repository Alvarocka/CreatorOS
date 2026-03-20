import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Profile } from '@/src/types/app';

export const LOCAL_WORKSPACE_ID = 'creatoros-local-workspace';
const LOCAL_PROFILE_STORAGE_KEY = 'creatoros:workspace-profile';

export function defaultWorkspaceProfile(): Profile {
  return {
    avatar_url: null,
    bio: 'Workspace local-first para capturar ideas multimedia sin depender de la nube.',
    display_name: 'Creator',
    id: LOCAL_WORKSPACE_ID,
    username: 'local-device',
  };
}

export async function loadWorkspaceProfile() {
  const raw = await AsyncStorage.getItem(LOCAL_PROFILE_STORAGE_KEY);
  if (!raw) return defaultWorkspaceProfile();

  try {
    const parsed = JSON.parse(raw) as Profile;
    return {
      ...defaultWorkspaceProfile(),
      ...parsed,
    };
  } catch {
    return defaultWorkspaceProfile();
  }
}

export async function saveWorkspaceProfile(profile: Profile) {
  await AsyncStorage.setItem(LOCAL_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}
