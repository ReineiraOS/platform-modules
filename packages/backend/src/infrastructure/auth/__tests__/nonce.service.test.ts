import { describe, it, expect, beforeEach } from 'vitest';
import { NonceService } from '../nonce.service.js';
import { MemoryNonceRepository } from '../../repository/memory/memory-nonce.repository.js';

describe('NonceService', () => {
  let service: NonceService;
  let repository: MemoryNonceRepository;

  beforeEach(() => {
    repository = new MemoryNonceRepository();
    service = new NonceService(repository);
  });

  describe('generateNonce', () => {
    it('returns a hex string of 64 characters', async () => {
      const nonce = await service.generateNonce('0xabc');
      expect(nonce).toMatch(/^[0-9a-f]{64}$/);
    });

    it('stores the nonce so it can be verified', async () => {
      const walletAddress = '0xdeadbeef';
      const nonce = await service.generateNonce(walletAddress);
      const valid = await service.verifyNonce(walletAddress, nonce);
      expect(valid).toBe(true);
    });

    it('generates unique nonces on each call', async () => {
      const nonce1 = await service.generateNonce('0xabc');
      const nonce2 = await service.generateNonce('0xabc');
      expect(nonce1).not.toBe(nonce2);
    });
  });

  describe('verifyNonce', () => {
    it('returns true for a valid nonce and deletes it', async () => {
      const walletAddress = '0xaaa';
      const nonce = await service.generateNonce(walletAddress);

      const result = await service.verifyNonce(walletAddress, nonce);
      expect(result).toBe(true);

      const secondAttempt = await service.verifyNonce(walletAddress, nonce);
      expect(secondAttempt).toBe(false);
    });

    it('returns false for an unknown nonce', async () => {
      const result = await service.verifyNonce('0xbbb', 'nonexistent');
      expect(result).toBe(false);
    });

    it('returns false for a nonce that belongs to a different address', async () => {
      const nonce = await service.generateNonce('0xccc');
      const result = await service.verifyNonce('0xddd', nonce);
      expect(result).toBe(false);
    });

    it('returns false for an expired nonce', async () => {
      const walletAddress = '0xeee';
      await repository.save(walletAddress, 'expiredNonce', -1);
      const result = await service.verifyNonce(walletAddress, 'expiredNonce');
      expect(result).toBe(false);
    });
  });
});
