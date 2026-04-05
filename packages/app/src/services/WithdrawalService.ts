import { httpClient } from '@/http-client/HttpClient';
import type { PaginatedResponse } from '@/services/TransactionService';

export interface CreateWithdrawalRequest {
  escrow_ids: number[];
  destination_chain: string;
  recipient_address: string;
}

export interface WithdrawalCall {
  contract_address: string;
  abi_function_signature: string;
  abi_parameters: Record<string, unknown>;
}

export interface CreateWithdrawalResponse {
  public_id: string;
  calls: WithdrawalCall[];
  status: string;
  estimated_amount: number;
}

export interface WithdrawalResponse {
  public_id: string;
  escrow_ids: number[];
  destination_chain: string;
  destination_domain: number;
  recipient_address: string;
  status: string;
  estimated_amount: number;
  wallet_provider: string;
  actual_amount?: number;
  fee?: number;
  redeem_tx_hash?: string;
  bridge_tx_hash?: string;
  destination_tx_hash?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export class WithdrawalService {
  static async create(req: CreateWithdrawalRequest): Promise<CreateWithdrawalResponse> {
    const { data } = await httpClient.post<CreateWithdrawalResponse>('/v1/withdrawals', req);
    return data;
  }

  static async list(params?: {
    limit?: number;
    continuation_token?: string;
    status?: string;
  }): Promise<PaginatedResponse<WithdrawalResponse>> {
    const { data } = await httpClient.get<PaginatedResponse<WithdrawalResponse>>('/v1/withdrawals', { params });
    return data;
  }

  static async getById(publicId: string): Promise<WithdrawalResponse> {
    const { data } = await httpClient.get<WithdrawalResponse>(`/v1/withdrawals/${publicId}`);
    return data;
  }

  static async reportTransaction(
    txHash: string,
    step: string,
    withdrawalPublicId: string,
  ): Promise<{ public_id: string; tx_hash: string; step: string; status: string }> {
    const { data } = await httpClient.post<{ public_id: string; tx_hash: string; step: string; status: string }>(
      `/v1/withdrawals/${withdrawalPublicId}/transactions`,
      { tx_hash: txHash, step },
    );
    return data;
  }

  static async bridgeChallenge(publicId: string): Promise<{ public_id: string; challenge: string; status: string }> {
    const { data } = await httpClient.post<{ public_id: string; challenge: string; status: string }>(
      `/v1/withdrawals/${publicId}/bridge/challenge`,
    );
    return data;
  }

  static async bridgeReadiness(publicId: string): Promise<{ public_id: string; ready: boolean; status: string }> {
    const { data } = await httpClient.get<{ public_id: string; ready: boolean; status: string }>(
      `/v1/withdrawals/${publicId}/bridge/readiness`,
    );
    return data;
  }
}
