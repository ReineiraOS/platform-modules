import { httpClient } from '@/http-client/HttpClient';

export interface BalanceResponse {
  wallet_address: string;
  balance: string;
  formatted_balance: string;
  currency: string;
  chain_id: number;
}

export class BalanceService {
  static async getBalance(): Promise<BalanceResponse> {
    const { data } = await httpClient.get<BalanceResponse>('/v1/balance');
    return data;
  }
}
