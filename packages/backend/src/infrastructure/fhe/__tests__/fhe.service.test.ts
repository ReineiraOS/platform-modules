import { describe, it, expect, vi, beforeEach } from 'vitest';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-for-fhe-service';

import { FheService } from '../fhe.service.js';

const OWNER_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';
const USER_ADDRESS = '0xabcdef1234567890abcdef1234567890abcdef12';

function makeBatchResponse(amountData: string, ownerData: string) {
  return {
    results: [
      {
        type: 'euint64',
        data: amountData,
        securityZone: 0,
        utype: 4,
        inputProof: '0xaaaa',
        encryptionTimeMs: 120,
      },
      {
        type: 'eaddress',
        data: ownerData,
        securityZone: 0,
        utype: 12,
        inputProof: '0xbbbb',
        encryptionTimeMs: 80,
      },
    ],
    totalEncryptionTimeMs: 200,
  };
}

function mockFetchSuccess(body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(body),
  });
}

describe('FheService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('encryptEscrowData', () => {
    it('returns an EncryptedEscrowData with encryptedAmount and encryptedOwner', async () => {
      const batch = makeBatchResponse('0xenc_amount_1', '0xenc_owner_1');
      vi.stubGlobal('fetch', mockFetchSuccess(batch));

      const service = new FheService();
      const result = await service.encryptEscrowData(1000000n, OWNER_ADDRESS, USER_ADDRESS);

      expect(result.encryptedAmount).toBeDefined();
      expect(result.encryptedOwner).toBeDefined();
    });

    it('encrypted amount has euint64 type with correct data from worker', async () => {
      const batch = makeBatchResponse('0xabc123', '0xdef456');
      vi.stubGlobal('fetch', mockFetchSuccess(batch));

      const service = new FheService();
      const result = await service.encryptEscrowData(500n, OWNER_ADDRESS, USER_ADDRESS);

      expect(result.encryptedAmount.type).toBe('euint64');
      expect(result.encryptedAmount.data).toBe('0xabc123');
      expect(result.encryptedAmount.inputProof).toBe('0xaaaa');
      expect(result.encryptedAmount.securityZone).toBe(0);
      expect(result.encryptedAmount.utype).toBe(4);
    });

    it('encrypted owner has eaddress type with correct utype', async () => {
      const batch = makeBatchResponse('0xabc123', '0xdef456');
      vi.stubGlobal('fetch', mockFetchSuccess(batch));

      const service = new FheService();
      const result = await service.encryptEscrowData(500n, OWNER_ADDRESS, USER_ADDRESS);

      expect(result.encryptedOwner.type).toBe('eaddress');
      expect(result.encryptedOwner.data).toBe('0xdef456');
      expect(result.encryptedOwner.securityZone).toBe(0);
      expect(result.encryptedOwner.utype).toBe(12);
    });

    it('stores plaintext amount and owner address', async () => {
      const batch = makeBatchResponse('0x01', '0x02');
      vi.stubGlobal('fetch', mockFetchSuccess(batch));

      const service = new FheService();
      const amount = 123456789n;
      const result = await service.encryptEscrowData(amount, OWNER_ADDRESS, USER_ADDRESS);

      expect(result.plaintextAmount).toBe(amount);
      expect(result.plaintextOwner).toBe(OWNER_ADDRESS);
    });

    it('stores the user address', async () => {
      const batch = makeBatchResponse('0x01', '0x02');
      vi.stubGlobal('fetch', mockFetchSuccess(batch));

      const service = new FheService();
      const result = await service.encryptEscrowData(100n, OWNER_ADDRESS, USER_ADDRESS);

      expect(result.userAddress).toBe(USER_ADDRESS);
    });

    it('getContractCallParameters returns a tuple of 4 elements for each encrypted field', async () => {
      const batch = makeBatchResponse('0x01', '0x02');
      vi.stubGlobal('fetch', mockFetchSuccess(batch));

      const service = new FheService();
      const result = await service.encryptEscrowData(100n, OWNER_ADDRESS, USER_ADDRESS);
      const params = result.getContractCallParameters();

      expect(params.encrypted_amount).toHaveLength(4);
      expect(params.encrypted_owner).toHaveLength(4);
      expect(params.resolver).toBe('0x0000000000000000000000000000000000000000');
      expect(params.resolver_data).toBe('0x');
    });

    it('sends correct payload to the FHE worker', async () => {
      const batch = makeBatchResponse('0x01', '0x02');
      const fetchMock = mockFetchSuccess(batch);
      vi.stubGlobal('fetch', fetchMock);

      const service = new FheService();
      await service.encryptEscrowData(999n, OWNER_ADDRESS, USER_ADDRESS);

      const batchCall = fetchMock.mock.calls.find(
        (c: unknown[]) => typeof c[0] === 'string' && c[0].includes('/api/v1/encrypt/batch'),
      );
      expect(batchCall).toBeDefined();

      const body = JSON.parse((batchCall![1] as RequestInit).body as string);
      expect(body.userAddress).toBe(USER_ADDRESS);
      expect(body.items).toEqual([
        { type: 'euint64', value: '999' },
        { type: 'eaddress', value: OWNER_ADDRESS },
      ]);
    });

    it('throws when the FHE worker returns an error', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.resolve({ detail: 'encryption failure' }),
        }),
      );

      const service = new FheService();
      await expect(service.encryptEscrowData(100n, OWNER_ADDRESS, USER_ADDRESS)).rejects.toThrow(
        'FHE encryption failed',
      );
    });
  });
});
