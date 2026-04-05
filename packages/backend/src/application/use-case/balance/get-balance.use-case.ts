import { getEnv } from '../../../core/config.js';
import type { BalanceResponse } from '../../dto/balance/balance-response.dto.js';

export class GetBalanceUseCase {
  async execute(walletAddress: string): Promise<BalanceResponse> {
    const env = getEnv();

    return {
      wallet_address: walletAddress,
      balance: '0',
      formatted_balance: '0.00',
      currency: 'USDC',
      chain_id: env.CHAIN_ID,
    };
  }
}
