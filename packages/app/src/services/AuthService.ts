import { httpClient } from '@/http-client/HttpClient';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export class AuthService {
  static async requestNonce(walletAddress: string): Promise<{ nonce: string }> {
    const { data } = await httpClient.post<{ nonce: string }>('/v1/auth/wallet/nonce', {
      wallet_address: walletAddress,
    });
    return data;
  }

  static async verifyWallet(
    walletAddress: string,
    message: string,
    signature: string,
    email?: string,
  ): Promise<TokenResponse> {
    const { data } = await httpClient.post<TokenResponse>('/v1/auth/wallet/verify', {
      wallet_address: walletAddress,
      message,
      signature,
      ...(email && { email }),
    });
    return data;
  }

  static async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const { data } = await httpClient.post<TokenResponse>('/v1/auth/tokens/refresh', {
      refresh_token: refreshToken,
    });
    return data;
  }

  static async logout(): Promise<void> {
    await httpClient.delete('/v1/auth/tokens');
  }
}
