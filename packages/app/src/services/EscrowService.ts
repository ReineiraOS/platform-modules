import { httpClient } from '@/http-client/HttpClient';
import type { CreateTransactionRequest } from '@/services/TransactionService';

export interface CreateEscrowClientEncryptResponse {
  public_id: string;
  contract_address: string;
  abi_function_signature: string;
  abi_parameters: {
    resolver: string;
    resolver_data: string;
  };
  owner_address: string;
  amount: number;
  amount_smallest_unit: string;
}

export class EscrowService {
  static async createWithClientEncrypt(req: CreateTransactionRequest): Promise<CreateEscrowClientEncryptResponse> {
    const { data } = await httpClient.post<CreateEscrowClientEncryptResponse>('/v1/escrows', req, {
      headers: { 'X-Encryption-Mode': 'client' },
    });
    return data;
  }

  static async reportTransaction(
    txHash: string,
    entityId: string,
  ): Promise<{ entity_id: string; tx_hash: string; status: string }> {
    const { data } = await httpClient.post<{ entity_id: string; tx_hash: string; status: string }>(
      '/v1/transactions/escrows/report',
      { tx_hash: txHash, entity_id: entityId },
    );
    return data;
  }
}
