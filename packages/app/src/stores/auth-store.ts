import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  walletAddress: string | null;
  walletProvider: string | null;
  isAuthorized: () => boolean;
  setTokens: (access: string, refresh: string) => void;
  setWallet: (address: string, provider: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  walletAddress: localStorage.getItem('wallet_address'),
  walletProvider: localStorage.getItem('wallet_provider'),

  isAuthorized: () => !!get().accessToken,

  setTokens: (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    set({ accessToken: access, refreshToken: refresh });
  },

  setWallet: (address, provider) => {
    localStorage.setItem('wallet_address', address);
    localStorage.setItem('wallet_provider', provider);
    set({ walletAddress: address, walletProvider: provider });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_provider');
    set({
      accessToken: null,
      refreshToken: null,
      walletAddress: null,
      walletProvider: null,
    });
  },
}));
