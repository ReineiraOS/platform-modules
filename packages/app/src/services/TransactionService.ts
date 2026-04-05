import { httpClient } from '@/http-client/HttpClient';

export interface CreateTransactionRequest {
  counterparty?: string;
  deadline?: string;
  external_reference?: string;
  amount: number;
  type: string;
  currency: { type: string; code: string };
  metadata?: Record<string, unknown>;
}

export interface CreateTransactionResponse {
  public_id: string;
  contract_address: string;
  abi_function_signature: string;
  abi_parameters: {
    encrypted_owner: [string, number, number, string];
    encrypted_amount: [string, number, number, string];
    resolver: string;
    resolver_data: string;
  };
}

export interface TransactionResponse {
  public_id: string;
  counterparty: string;
  deadline: string;
  external_reference: string;
  amount: number;
  currency: { type: string; code: string };
  status: string;
  on_chain_escrow_id?: string;
  tx_hash?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  continuation_token?: string;
  has_more: boolean;
  limit: number;
}

export class TransactionService {
  static async create(req: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    const { data } = await httpClient.post<CreateTransactionResponse>('/v1/escrows', req);
    return data;
  }

  static async list(params?: {
    limit?: number;
    continuation_token?: string;
    status?: string;
  }): Promise<PaginatedResponse<TransactionResponse>> {
    const { data } = await httpClient.get<PaginatedResponse<TransactionResponse>>('/v1/escrows', { params });
    return data;
  }

  static async getById(publicId: string): Promise<TransactionResponse> {
    const { data } = await httpClient.get<TransactionResponse>(`/v1/escrows/${publicId}`);
    return data;
  }

  static async reportTransaction(
    txHash: string,
    entityId: string,
  ): Promise<{ entity_id: string; tx_hash: string; status: string }> {
    const { data } = await httpClient.post<{ entity_id: string; tx_hash: string; status: string }>(
      '/v1/escrows/transactions',
      { tx_hash: txHash, entity_id: entityId },
    );
    return data;
  }
}
