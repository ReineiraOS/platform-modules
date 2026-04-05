import { create } from 'zustand';
import type { IWalletProvider } from '@/providers/wallet-provider.interface';
import { ZeroDevProvider } from '@/providers/zerodev/zerodev.provider';

export type WalletProviderType = 'zerodev';

let _provider: IWalletProvider | null = null;
let _reconnectPromise: Promise<void> | null = null;

interface WalletState {
  activeProviderType: WalletProviderType | null;
  address: string | null;
  connecting: boolean;
  error: string | null;
  isConnected: () => boolean;
  connect: (type: WalletProviderType) => Promise<string>;
  register: (username: string) => Promise<string>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendUserOperation: (calls: Array<{ to: string; data: string; value?: bigint }>) => Promise<string>;
  ensureConnected: () => Promise<void>;
}

async function reconnect(): Promise<void> {
  const p = new ZeroDevProvider();
  const addr = await p.connect();
  _provider = p;
  useWalletStore.setState({ activeProviderType: 'zerodev', address: addr });
}

export const useWalletStore = create<WalletState>((set, get) => ({
  activeProviderType: null,
  address: null,
  connecting: false,
  error: null,

  isConnected: () => !!get().address && !!_provider,

  ensureConnected: async () => {
    if (_provider) return;
    if (_reconnectPromise) {
      await _reconnectPromise;
      return;
    }
    _reconnectPromise = reconnect();
    try {
      await _reconnectPromise;
    } finally {
      _reconnectPromise = null;
    }
  },

  connect: async (type) => {
    set({ connecting: true, error: null });
    try {
      const p = new ZeroDevProvider();
      const addr = await p.connect();
      _provider = p;
      set({ activeProviderType: type, address: addr });
      return addr;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Connection failed';
      set({ error: msg });
      throw e;
    } finally {
      set({ connecting: false });
    }
  },

  register: async (username) => {
    set({ connecting: true, error: null });
    try {
      const p = new ZeroDevProvider();
      const addr = await p.register(username);
      _provider = p;
      set({ activeProviderType: 'zerodev', address: addr });
      return addr;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Registration failed';
      set({ error: msg });
      throw e;
    } finally {
      set({ connecting: false });
    }
  },

  disconnect: async () => {
    if (_provider) {
      await _provider.disconnect();
    }
    _provider = null;
    set({ activeProviderType: null, address: null });
  },

  signMessage: async (message) => {
    await useWalletStore.getState().ensureConnected();
    if (!_provider) throw new Error('No wallet connected');
    return _provider.signMessage(message);
  },

  sendUserOperation: async (calls) => {
    await useWalletStore.getState().ensureConnected();
    if (!_provider) throw new Error('No wallet connected');
    return _provider.sendUserOperation(calls);
  },
}));
