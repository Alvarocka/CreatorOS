"use client";

import { create } from "zustand";

type PlayerState = {
  currentTrack: {
    id: string;
    title: string;
    description?: string | null;
    src: string;
  } | null;
  isLooping: boolean;
  playbackRate: number;
  setTrack: (track: PlayerState["currentTrack"]) => void;
  clearTrack: () => void;
  toggleLoop: () => void;
  setPlaybackRate: (rate: number) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isLooping: false,
  playbackRate: 1,
  clearTrack: () => set({ currentTrack: null }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setTrack: (track) => set({ currentTrack: track }),
  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping }))
}));
