import { eq } from 'drizzle-orm';
import type { IEscrowEventRepository } from '../../../domain/escrow/events/repository/escrow-event.repository.js';
import {
  EscrowEvent,
  type EscrowEventType,
} from '../../../domain/escrow/events/model/escrow-event.js';
import { escrowEvents } from './schema.js';
import type { Db } from './db.js';

export class PgEscrowEventRepository implements IEscrowEventRepository {
  constructor(private readonly db: Db) {}

  async findByTxHash(txHash: string): Promise<EscrowEvent | null> {
    const row = await this.db.query.escrowEvents.findFirst({
      where: eq(escrowEvents.txHash, txHash),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByEscrowId(escrowId: string): Promise<EscrowEvent | null> {
    const row = await this.db.query.escrowEvents.findFirst({
      where: eq(escrowEvents.escrowId, escrowId),
    });
    return row ? this.toDomain(row) : null;
  }

  async save(event: EscrowEvent): Promise<void> {
    await this.db.insert(escrowEvents).values({
      txHash: event.txHash,
      escrowId: event.escrowId,
      eventType: event.eventType,
      blockNumber: event.blockNumber,
      createdAt: event.createdAt,
      ttl: event.ttl,
      messageHash: event.messageHash,
      amount: event.amount,
    });
  }

  async delete(txHash: string): Promise<void> {
    await this.db
      .delete(escrowEvents)
      .where(eq(escrowEvents.txHash, txHash));
  }

  private toDomain(row: typeof escrowEvents.$inferSelect): EscrowEvent {
    return new EscrowEvent({
      txHash: row.txHash,
      escrowId: row.escrowId,
      eventType: row.eventType as EscrowEventType,
      blockNumber: row.blockNumber,
      createdAt: row.createdAt,
      ttl: row.ttl,
      messageHash: row.messageHash ?? undefined,
      amount: row.amount ?? undefined,
    });
  }
}
