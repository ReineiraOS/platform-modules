import { useAuthStore } from '@/stores/auth-store';
import { useWalletStore } from '@/stores/wallet-store';
import { AuthService } from '@/services/AuthService';

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

async function authenticateWithSiwe(address: string) {
  const { nonce } = await AuthService.requestNonce(address);

  const domain = window.location.host;
  const origin = window.location.origin;
  const statement = 'Sign in to ReineiraOS';
  const message = buildSiweMessage(domain, address, statement, origin, nonce);

  const signature = await useWalletStore.getState().signMessage(message);
  const tokenResponse = await AuthService.verifyWallet(address, message, signature);

  useAuthStore.getState().setTokens(tokenResponse.access_token, tokenResponse.refresh_token);
  useAuthStore.getState().setWallet(address, 'zerodev');
}

export function useAuth() {
  const walletConnect = useWalletStore((s) => s.connect);
  const walletRegister = useWalletStore((s) => s.register);
  const walletDisconnect = useWalletStore((s) => s.disconnect);
  const authLogout = useAuthStore((s) => s.logout);

  async function login() {
    const address = await walletConnect('zerodev');
    await authenticateWithSiwe(address);
  }

  async function register(username: string) {
    const address = await walletRegister(username);
    await authenticateWithSiwe(address);
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
