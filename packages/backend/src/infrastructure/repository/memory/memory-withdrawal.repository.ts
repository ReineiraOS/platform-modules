import type {
  IWithdrawalRepository,
  FindWithdrawalsByUserIdOptions,
  PaginatedResult,
} from '../../../domain/withdrawal/repository/withdrawal.repository.js';
import type { Withdrawal } from '../../../domain/withdrawal/model/withdrawal.js';

export class MemoryWithdrawalRepository implements IWithdrawalRepository {
  private readonly store = new Map<string, Withdrawal>();

  async findById(id: string): Promise<Withdrawal | null> {
    return this.store.get(id) ?? null;
  }

  async findByPublicId(publicId: string): Promise<Withdrawal | null> {
    for (const withdrawal of this.store.values()) {
      if (withdrawal.publicId === publicId) return withdrawal;
    }
    return null;
  }

  async findByUserId(userId: string, options?: FindWithdrawalsByUserIdOptions): Promise<PaginatedResult<Withdrawal>> {
    let items = [...this.store.values()]
      .filter((w) => w.userId === userId)
      .filter((w) => (options?.status ? w.status === options.status : true))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (options?.cursor) {
      const cursorIndex = items.findIndex((w) => w.publicId === options.cursor);
      if (cursorIndex !== -1) {
        items = items.slice(cursorIndex + 1);
      }
    }

    const limit = options?.limit ?? 20;
    const page = items.slice(0, limit);
    const nextCursor = page.length === limit ? page[page.length - 1]!.publicId : undefined;

    return { items: page, cursor: nextCursor };
  }

  async save(withdrawal: Withdrawal): Promise<void> {
    this.store.set(withdrawal.id, withdrawal);
  }

  async update(withdrawal: Withdrawal): Promise<void> {
    this.store.set(withdrawal.id, withdrawal);
  }
}
