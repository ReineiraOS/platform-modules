export type WalletProvider = 'zerodev' | 'walletconnect';

export interface UserParams {
  id: string;
  walletAddress: string;
  walletProvider: WalletProvider;
  email?: string;
  createdAt: Date;
}

export class User {
  readonly id: string;
  readonly walletAddress: string;
  readonly walletProvider: WalletProvider;
  readonly email?: string;
  readonly createdAt: Date;

  constructor(params: UserParams) {
    this.id = params.id;
    this.walletAddress = params.walletAddress;
    this.walletProvider = params.walletProvider;
    this.email = params.email;
    this.createdAt = params.createdAt;
  }
}
