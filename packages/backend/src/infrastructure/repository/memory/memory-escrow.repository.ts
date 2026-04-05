import type {
  IEscrowRepository,
  FindByUserIdOptions,
  PaginatedResult,
} from '../../../domain/escrow/repository/escrow.repository.js';
import type { Escrow } from '../../../domain/escrow/model/escrow.js';

export class MemoryEscrowRepository implements IEscrowRepository {
  private readonly store = new Map<string, Escrow>();

  async findById(id: string): Promise<Escrow | null> {
    return this.store.get(id) ?? null;
  }

  async findByPublicId(publicId: string): Promise<Escrow | null> {
    for (const escrow of this.store.values()) {
      if (escrow.publicId === publicId) return escrow;
    }
    return null;
  }

  async findByUserId(
    userId: string,
    options?: FindByUserIdOptions,
  ): Promise<PaginatedResult<Escrow>> {
    let items = [...this.store.values()]
      .filter((i) => i.userId === userId)
      .filter((i) => (options?.status ? i.status === options.status : true))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (options?.cursor) {
      const cursorIndex = items.findIndex((i) => i.publicId === options.cursor);
      if (cursorIndex !== -1) {
        items = items.slice(cursorIndex + 1);
      }
    }

    const limit = options?.limit ?? 20;
    const page = items.slice(0, limit);
    const nextCursor = page.length === limit ? page[page.length - 1]!.publicId : undefined;

    return { items: page, cursor: nextCursor };
  }

  async findByTxHash(txHash: string): Promise<Escrow | null> {
    for (const escrow of this.store.values()) {
      if (escrow.txHash === txHash) return escrow;
    }
    return null;
  }

  async findByOnChainId(onChainId: string): Promise<Escrow | null> {
    for (const escrow of this.store.values()) {
      if (escrow.onChainEscrowId === onChainId) return escrow;
    }
    return null;
  }

  async save(escrow: Escrow): Promise<void> {
    this.store.set(escrow.id, escrow);
  }

  async update(escrow: Escrow): Promise<void> {
    this.store.set(escrow.id, escrow);
  }
}
