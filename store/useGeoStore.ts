// store/useGeoStore.ts
import { create } from 'zustand';

export interface Landmark {
  id: string;
  name: string;
  image: string;
  confidence: number;
  description: string;
}

interface GeoState {
  currentImage: string | null;
  currentLandmark: Landmark | null;
  isUploading: boolean;
  chat: { role: 'user' | 'bot'; text: string }[];
  setImage: (uri: string | null) => void;
  setLandmark: (data: Landmark | null) => void;
  setUploading: (v: boolean) => void;
  addChat: (role: 'user' | 'bot', text: string) => void;
  clear: () => void;
}

export const useGeoStore = create<GeoState>((set) => ({
  currentImage: null,
  currentLandmark: null,
  isUploading: false,
  chat: [],
  setImage: (uri) => set({ currentImage: uri }),
  setLandmark: (data) => set({ currentLandmark: data }),
  setUploading: (v) => set({ isUploading: v }),
  addChat: (role, text) => set((s) => ({ chat: [...s.chat, { role, text }] })),
  clear: () => set({ currentImage: null, currentLandmark: null, chat: [] }),
}));