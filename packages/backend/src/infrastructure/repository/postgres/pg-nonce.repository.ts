import { and, eq } from 'drizzle-orm';
import type { INonceRepository } from '../../../domain/nonce/repository/nonce.repository.js';
import { nonces } from './schema.js';
import type { Db } from './db.js';

export class PgNonceRepository implements INonceRepository {
  constructor(private readonly db: Db) {}

  async save(
    walletAddress: string,
    nonce: string,
    ttlSeconds: number,
  ): Promise<void> {
    const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
    await this.db
      .insert(nonces)
      .values({ walletAddress, nonce, expiresAt })
      .onConflictDoUpdate({
        target: [nonces.walletAddress, nonces.nonce],
        set: { expiresAt },
      });
  }

  async findAndDelete(
    walletAddress: string,
    nonce: string,
  ): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000);
    const deleted = await this.db
      .delete(nonces)
      .where(
        and(eq(nonces.walletAddress, walletAddress), eq(nonces.nonce, nonce)),
      )
      .returning();

    if (deleted.length === 0) return false;
    return deleted[0]!.expiresAt > now;
  }
}
