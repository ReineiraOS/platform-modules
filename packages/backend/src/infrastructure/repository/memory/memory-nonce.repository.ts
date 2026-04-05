import type { INonceRepository } from '../../../domain/nonce/repository/nonce.repository.js';

interface NonceEntry {
  nonce: string;
  expiresAt: number;
}

export class MemoryNonceRepository implements INonceRepository {
  private readonly store = new Map<string, NonceEntry>();

  async save(walletAddress: string, nonce: string, ttlSeconds: number): Promise<void> {
    const key = `${walletAddress}:${nonce}`;
    this.store.set(key, { nonce, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  async findAndDelete(walletAddress: string, nonce: string): Promise<boolean> {
    const key = `${walletAddress}:${nonce}`;
    const entry = this.store.get(key);

    if (!entry || entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return false;
    }

    this.store.delete(key);
    return true;
  }
}
