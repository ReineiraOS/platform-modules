import type { Escrow } from '../model/escrow.js';
import type { EscrowStatus } from '../model/escrow-status.enum.js';

export interface FindByUserIdOptions {
  limit?: number;
  cursor?: string;
  status?: EscrowStatus;
}

export interface PaginatedResult<T> {
  items: T[];
  cursor?: string;
}

export interface IEscrowRepository {
  findById(id: string): Promise<Escrow | null>;
  findByPublicId(publicId: string): Promise<Escrow | null>;
  findByUserId(userId: string, options?: FindByUserIdOptions): Promise<PaginatedResult<Escrow>>;
  findByTxHash(txHash: string): Promise<Escrow | null>;
  findByOnChainId(onChainId: string): Promise<Escrow | null>;
  save(escrow: Escrow): Promise<void>;
  update(escrow: Escrow): Promise<void>;
}
