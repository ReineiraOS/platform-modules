export interface AuthPayload {
  userId: string;
  walletAddress: string;
  walletProvider: string;
  email?: string;
  exp: number;
  iat: number;
  iss: string;
  authSource: 'wallet' | 'oauth';
  clientId?: string;
}
