import type { IWalletProvider, Call } from '../wallet-provider.interface';
import { Account, type AccountConfig } from '@jaw.id/core';
import type { Address, Hex } from 'viem';
import { WindowHelper } from '@/helpers/WindowHelper';

const DEFAULT_CHAIN_ID = 421614; // Arbitrum Sepolia

function getConfig(): AccountConfig {
  const apiKey = import.meta.env.VITE_JAW_API_KEY;
  if (!apiKey) throw new Error('VITE_JAW_API_KEY is not set');
  const paymasterUrl = import.meta.env.VITE_JAW_PAYMASTER_URL;
  return {
    chainId: DEFAULT_CHAIN_ID,
    apiKey,
    ...(paymasterUrl ? { paymasterUrl } : {}),
  };
}

export class JawProvider implements IWalletProvider {
  private account: Account | null = null;

  async connect(): Promise<string> {
    const config = getConfig();

    if (Account.getAuthenticatedAddress(config.apiKey)) {
      this.account = await Account.get(config);
      return this.account.address;
    }

    return this.login();
  }

  async login(): Promise<string> {
    const config = getConfig();
    await WindowHelper.ensureFocus();
    this.account = await Account.import(config);
    return this.account.address;
  }

  async register(username: string): Promise<string> {
    const config = getConfig();
    await WindowHelper.ensureFocus();
    this.account = await Account.create(config, { username });
    return this.account.address;
  }

  async disconnect(): Promise<void> {
    const { apiKey } = getConfig();
    Account.logout(apiKey);
    this.account = null;
  }

  async signMessage(message: string): Promise<string> {
    if (!this.account) throw new Error('Not connected');
    await WindowHelper.ensureFocus();
    return this.account.signMessage(message);
  }

  getAddress(): string | null {
    return this.account?.address ?? null;
  }

  isConnected(): boolean {
    return this.account !== null;
  }

  async sendUserOperation(calls: Call[]): Promise<string> {
    if (!this.account) throw new Error('Not connected');
    return this.account.sendTransaction(
      calls.map((c) => ({
        to: c.to as Address,
        data: (c.data ?? '0x') as Hex,
        value: c.value,
      })),
    );
  }
}
