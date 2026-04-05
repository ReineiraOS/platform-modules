import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/stores/auth-store';

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
  });

  it('has correct initial state when localStorage is empty', () => {
    const state = useAuthStore.getState();

    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.walletAddress).toBeNull();
    expect(state.walletProvider).toBeNull();
  });

  describe('setTokens', () => {
    it('saves tokens to localStorage and updates state', () => {
      useAuthStore.getState().setTokens('access-123', 'refresh-456');

      const state = useAuthStore.getState();
      expect(state.accessToken).toBe('access-123');
      expect(state.refreshToken).toBe('refresh-456');
      expect(localStorage.getItem('access_token')).toBe('access-123');
      expect(localStorage.getItem('refresh_token')).toBe('refresh-456');
    });
  });

  describe('setWallet', () => {
    it('saves wallet to localStorage and updates state', () => {
      useAuthStore.getState().setWallet('0xabc', 'zerodev');

      const state = useAuthStore.getState();
      expect(state.walletAddress).toBe('0xabc');
      expect(state.walletProvider).toBe('zerodev');
      expect(localStorage.getItem('wallet_address')).toBe('0xabc');
      expect(localStorage.getItem('wallet_provider')).toBe('zerodev');
    });
  });

  describe('logout', () => {
    it('clears localStorage and resets state', () => {
      useAuthStore.getState().setTokens('access-123', 'refresh-456');
      useAuthStore.getState().setWallet('0xabc', 'zerodev');

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.walletAddress).toBeNull();
      expect(state.walletProvider).toBeNull();
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('wallet_address')).toBeNull();
      expect(localStorage.getItem('wallet_provider')).toBeNull();
    });
  });

  describe('isAuthorized', () => {
    it('returns false when no access token', () => {
      expect(useAuthStore.getState().isAuthorized()).toBe(false);
    });

    it('returns true when access token exists', () => {
      useAuthStore.getState().setTokens('access-123', 'refresh-456');

      expect(useAuthStore.getState().isAuthorized()).toBe(true);
    });
  });
});
