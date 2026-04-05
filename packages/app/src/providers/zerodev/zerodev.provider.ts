import type { IWalletProvider, Call } from '../wallet-provider.interface';
import { toWebAuthnKey, WebAuthnMode, type WebAuthnKey } from '@zerodev/webauthn-key';
import { toPasskeyValidator, PasskeyValidatorContractVersion } from '@zerodev/passkey-validator';
import { createKernelAccount, createKernelAccountClient, createZeroDevPaymasterClient, constants } from '@zerodev/sdk';
import type { KernelAccountClient } from '@zerodev/sdk';
import { createPublicClient, http, type Hex } from 'viem';
import { signMessage as viemSignMessage } from 'viem/actions';
import { arbitrumSepolia } from 'viem/chains';
import { entryPoint07Address } from 'viem/account-abstraction';
import { WindowHelper } from '@/helpers/WindowHelper';

const ENTRY_POINT = { address: entryPoint07Address, version: '0.7' as const };
const KERNEL_VERSION = constants.KERNEL_V3_1;

function getChain() {
  return arbitrumSepolia;
}

function buildPublicClient() {
  return createPublicClient({
    chain: getChain(),
    transport: http(import.meta.env.VITE_ZERODEV_BUNDLER_URL),
  });
}

async function buildKernelClient(webAuthnKey: WebAuthnKey): Promise<KernelAccountClient> {
  const publicClient = buildPublicClient();
  const chain = getChain();

  const passkeyValidator = await toPasskeyValidator(publicClient, {
    webAuthnKey,
    entryPoint: ENTRY_POINT,
    kernelVersion: KERNEL_VERSION,
    validatorContractVersion: PasskeyValidatorContractVersion.V0_0_3_PATCHED,
  });

  const account = await createKernelAccount(publicClient, {
    plugins: { sudo: passkeyValidator },
    entryPoint: ENTRY_POINT,
    kernelVersion: KERNEL_VERSION,
  });

  const zerodevRpcUrl = import.meta.env.VITE_ZERODEV_BUNDLER_URL;

  const paymaster = createZeroDevPaymasterClient({
    chain,
    transport: http(zerodevRpcUrl),
  });

  return createKernelAccountClient({
    account,
    chain,
    bundlerTransport: http(zerodevRpcUrl),
    paymaster,
  });
}

export class ZeroDevProvider implements IWalletProvider {
  private kernelClient: KernelAccountClient | null = null;
  private webAuthnKeyRef: WebAuthnKey | null = null;
  private _address: string | null = null;

  async connect(): Promise<string> {
    return this.login();
  }

  async register(username: string): Promise<string> {
    await WindowHelper.ensureFocus();

    const webAuthnKey = await toWebAuthnKey({
      passkeyName: username,
      passkeyServerUrl: import.meta.env.VITE_ZERODEV_PASSKEY_SERVER_URL,
      mode: WebAuthnMode.Register,
    });

    this.kernelClient = await buildKernelClient(webAuthnKey);
    this.webAuthnKeyRef = webAuthnKey;

    if (!this.kernelClient.account) {
      throw new Error('Kernel account not found');
    }

    this._address = this.kernelClient.account.address;
    return this._address;
  }

  async login(): Promise<string> {
    await WindowHelper.ensureFocus();

    const webAuthnKey = await toWebAuthnKey({
      passkeyName: '',
      passkeyServerUrl: import.meta.env.VITE_ZERODEV_PASSKEY_SERVER_URL,
      mode: WebAuthnMode.Login,
    });

    this.kernelClient = await buildKernelClient(webAuthnKey);
    this.webAuthnKeyRef = webAuthnKey;

    if (!this.kernelClient.account) {
      throw new Error('Kernel account not found');
    }

    this._address = this.kernelClient.account.address;
    return this._address;
  }

  async disconnect(): Promise<void> {
    this.kernelClient = null;
    this.webAuthnKeyRef = null;
    this._address = null;
  }

  async signMessage(message: string): Promise<string> {
    if (!this.kernelClient?.account) throw new Error('Not connected');
    await WindowHelper.ensureFocus();
    return viemSignMessage(this.kernelClient, {
      account: this.kernelClient.account,
      message,
    });
  }

  getAddress(): string | null {
    return this._address;
  }

  isConnected(): boolean {
    return this._address !== null && this.kernelClient !== null;
  }

  async sendUserOperation(calls: Call[]): Promise<string> {
    if (!this.kernelClient?.account) throw new Error('Not connected');

    const callData = await this.kernelClient.account.encodeCalls(
      calls.map((c) => ({
        to: c.to as Hex,
        data: c.data as Hex,
        value: c.value ?? 0n,
      })),
    );

    const userOpHash = await this.kernelClient.sendUserOperation({ callData });
    const receipt = await this.kernelClient.waitForUserOperationReceipt({ hash: userOpHash });
    return receipt.receipt.transactionHash;
  }
}
