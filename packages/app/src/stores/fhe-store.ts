import { create } from 'zustand';
import { fheService } from '@/services/FheService';

interface FheState {
  initialized: boolean;
  initializing: boolean;
  error: string | null;
  initialize: (walletAddress: string) => Promise<void>;
}

export const useFheStore = create<FheState>((set, get) => ({
  initialized: false,
  initializing: false,
  error: null,

  initialize: async (walletAddress) => {
    if (get().initialized || get().initializing) return;

    set({ initializing: true, error: null });

    try {
      await fheService.initialize(walletAddress);
      set({ initialized: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'FHE initialization failed';
      set({ error: message });
    } finally {
      set({ initializing: false });
    }
  },
}));
