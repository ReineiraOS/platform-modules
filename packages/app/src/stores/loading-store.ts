import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  message: string | null;
  start: (msg?: string) => void;
  stop: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  message: null,

  start: (msg) => set({ isLoading: true, message: msg ?? null }),
  stop: () => set({ isLoading: false, message: null }),
}));
