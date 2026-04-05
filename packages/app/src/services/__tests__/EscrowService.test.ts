import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/http-client/HttpClient', () => ({
  httpClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import { httpClient } from '@/http-client/HttpClient';
import { EscrowService } from '@/services/EscrowService';
import type { CreateTransactionRequest } from '@/services/TransactionService';

const mockPost = vi.mocked(httpClient.post);

describe('EscrowService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createWithClientEncrypt', () => {
    it('sends POST to /v1/escrows with X-Encryption-Mode: client header', async () => {
      const escrowResponse = {
        public_id: 'escrow-1',
        contract_address: '0xcontract',
        abi_function_signature: 'createEscrow(address,bytes)',
        abi_parameters: {
          resolver: '0xresolver',
          resolver_data: '0xdata',
        },
        owner_address: '0xowner',
        amount: 100,
        amount_smallest_unit: '100000000',
      };

      mockPost.mockResolvedValueOnce({ data: escrowResponse } as any);

      const request: CreateTransactionRequest = {
        counterparty: '0xcounterparty',
        deadline: '2026-12-31T00:00:00Z',
        external_reference: 'ref-123',
        amount: 100,
        type: 'payment',
        currency: { type: 'crypto', code: 'USDC' },
      };

      const result = await EscrowService.createWithClientEncrypt(request);

      expect(mockPost).toHaveBeenCalledWith('/v1/escrows', request, { headers: { 'X-Encryption-Mode': 'client' } });
      expect(result).toEqual(escrowResponse);
    });
  });

  describe('reportTransaction', () => {
    it('sends POST to /v1/transactions/escrows/report', async () => {
      const txResponse = {
        entity_id: 'escrow-1',
        tx_hash: '0xtxhash',
        status: 'pending',
      };

      mockPost.mockResolvedValueOnce({ data: txResponse } as any);

      const result = await EscrowService.reportTransaction('0xtxhash', 'escrow-1');

      expect(mockPost).toHaveBeenCalledWith('/v1/transactions/escrows/report', {
        tx_hash: '0xtxhash',
        entity_id: 'escrow-1',
      });
      expect(result).toEqual(txResponse);
    });
  });
});
