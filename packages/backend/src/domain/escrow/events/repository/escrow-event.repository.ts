import type { EscrowEvent } from '../model/escrow-event.js';

export interface IEscrowEventRepository {
  findByTxHash(txHash: string): Promise<EscrowEvent | null>;
  findByEscrowId(escrowId: string): Promise<EscrowEvent | null>;
  save(event: EscrowEvent): Promise<void>;
  delete(txHash: string): Promise<void>;
}
