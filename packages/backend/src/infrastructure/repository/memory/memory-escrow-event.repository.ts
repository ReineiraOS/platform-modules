import type { IEscrowEventRepository } from '../../../domain/escrow/events/repository/escrow-event.repository.js';
import type { EscrowEvent } from '../../../domain/escrow/events/model/escrow-event.js';

export class MemoryEscrowEventRepository implements IEscrowEventRepository {
  private readonly store = new Map<string, EscrowEvent>();

  async findByTxHash(txHash: string): Promise<EscrowEvent | null> {
    return this.store.get(txHash) ?? null;
  }

  async findByEscrowId(escrowId: string): Promise<EscrowEvent | null> {
    for (const event of this.store.values()) {
      if (event.escrowId === escrowId) return event;
    }
    return null;
  }

  async save(event: EscrowEvent): Promise<void> {
    this.store.set(event.txHash, event);
  }

  async delete(txHash: string): Promise<void> {
    this.store.delete(txHash);
  }
}
