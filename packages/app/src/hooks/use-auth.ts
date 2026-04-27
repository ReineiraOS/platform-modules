import { useAuthStore } from '@/stores/auth-store';
import { useWalletStore, type WalletProviderType } from '@/stores/wallet-store';
import { AuthService } from '@/services/AuthService';

const DEFAULT_PROVIDER: WalletProviderType = 'jaw';

function buildSiweMessage(domain: string, address: string, statement: string, uri: string, nonce: string): string {
  const now = new Date().toISOString();
  return [
    `${domain} wants you to sign in with your Ethereum account:`,
    address,
    '',
    statement,
    '',
    `URI: ${uri}`,
    'Version: 1',
    `Chain ID: ${import.meta.env.VITE_CHAIN_ID || '421614'}`,
    `Nonce: ${nonce}`,
    `Issued At: ${now}`,
  ].join('\n');
}

async function authenticateWithSiwe(address: string, providerType: WalletProviderType) {
  const { nonce } = await AuthService.requestNonce(address);

  const domain = window.location.host;
  const origin = window.location.origin;
  const statement = 'Sign in to ReineiraOS';
  const message = buildSiweMessage(domain, address, statement, origin, nonce);

  const signature = await useWalletStore.getState().signMessage(message);
  const tokenResponse = await AuthService.verifyWallet(address, message, signature, undefined, providerType);

  useAuthStore.getState().setTokens(tokenResponse.access_token, tokenResponse.refresh_token);
  useAuthStore.getState().setWallet(address, providerType);
}

export function useAuth() {
  const walletConnect = useWalletStore((s) => s.connect);
  const walletRegister = useWalletStore((s) => s.register);
  const walletDisconnect = useWalletStore((s) => s.disconnect);
  const authLogout = useAuthStore((s) => s.logout);

  async function login(providerType: WalletProviderType = DEFAULT_PROVIDER) {
    const address = await walletConnect(providerType);
    await authenticateWithSiwe(address, providerType);
  }

  async function register(username: string, providerType: WalletProviderType = DEFAULT_PROVIDER) {
    const address = await walletRegister(providerType, username);
    await authenticateWithSiwe(address, providerType);
  }

  async function logout() {
    try {
      await AuthService.logout();
    } catch {
    } finally {
      authLogout();
      await walletDisconnect();
    }
  }

  return { login, register, logout };
}
