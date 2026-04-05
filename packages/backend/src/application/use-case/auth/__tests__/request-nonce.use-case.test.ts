import { describe, it, expect, beforeEach } from 'vitest';
import { RequestNonceUseCase } from '../request-nonce.use-case.js';
import { NonceService } from '../../../../infrastructure/auth/nonce.service.js';
import { MemoryNonceRepository } from '../../../../infrastructure/repository/memory/memory-nonce.repository.js';

describe('RequestNonceUseCase', () => {
  let useCase: RequestNonceUseCase;

  beforeEach(() => {
    const repo = new MemoryNonceRepository();
    const nonceService = new NonceService(repo);
    useCase = new RequestNonceUseCase(nonceService);
  });

  it('returns a nonce for the given wallet address', async () => {
    const result = await useCase.execute({ wallet_address: '0xabc' });
    expect(result).toHaveProperty('nonce');
    expect(typeof result.nonce).toBe('string');
    expect(result.nonce.length).toBeGreaterThan(0);
  });

  it('returns a hex string of 64 characters', async () => {
    const result = await useCase.execute({ wallet_address: '0xabc' });
    expect(result.nonce).toMatch(/^[0-9a-f]{64}$/);
  });

  it('generates different nonces for sequential calls', async () => {
    const r1 = await useCase.execute({ wallet_address: '0xabc' });
    const r2 = await useCase.execute({ wallet_address: '0xabc' });
    expect(r1.nonce).not.toBe(r2.nonce);
  });
});
