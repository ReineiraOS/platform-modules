import { and, eq, lt, desc } from 'drizzle-orm';
import type {
  IWithdrawalRepository,
  FindWithdrawalsByUserIdOptions,
  PaginatedResult,
} from '../../../domain/withdrawal/repository/withdrawal.repository.js';
import { Withdrawal } from '../../../domain/withdrawal/model/withdrawal.js';
import type { DestinationChain } from '../../../domain/withdrawal/model/destination-chain.enum.js';
import { WithdrawalStatus } from '../../../domain/withdrawal/model/withdrawal-status.enum.js';
import { withdrawals } from './schema.js';
import type { Db } from './db.js';

export class PgWithdrawalRepository implements IWithdrawalRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string): Promise<Withdrawal | null> {
    const row = await this.db.query.withdrawals.findFirst({
      where: eq(withdrawals.id, id),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByPublicId(publicId: string): Promise<Withdrawal | null> {
    const row = await this.db.query.withdrawals.findFirst({
      where: eq(withdrawals.publicId, publicId),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(
    userId: string,
    options?: FindWithdrawalsByUserIdOptions,
  ): Promise<PaginatedResult<Withdrawal>> {
    const limit = options?.limit ?? 20;
    const conditions = [eq(withdrawals.userId, userId)];

    if (options?.status) {
      conditions.push(eq(withdrawals.status, options.status));
    }

    if (options?.cursor) {
      const cursorRow = await this.db.query.withdrawals.findFirst({
        where: eq(withdrawals.publicId, options.cursor),
        columns: { createdAt: true },
      });
      if (cursorRow) {
        conditions.push(lt(withdrawals.createdAt, cursorRow.createdAt));
      }
    }

    const rows = await this.db.query.withdrawals.findMany({
      where: and(...conditions),
      orderBy: [desc(withdrawals.createdAt)],
      limit: limit + 1,
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const items = page.map((r) => this.toDomain(r));
    const nextCursor = hasMore ? page[page.length - 1]!.publicId : undefined;

    return { items, cursor: nextCursor };
  }

  async save(withdrawal: Withdrawal): Promise<void> {
    await this.db.insert(withdrawals).values(this.toRow(withdrawal));
  }

  async update(withdrawal: Withdrawal): Promise<void> {
    await this.db
      .update(withdrawals)
      .set({
        status: withdrawal.status,
        actualAmount:
          withdrawal.actualAmount != null
            ? String(withdrawal.actualAmount)
            : null,
        fee: withdrawal.fee != null ? String(withdrawal.fee) : null,
        redeemTxHash: withdrawal.redeemTxHash,
        bridgeTxHash: withdrawal.bridgeTxHash,
        destinationTxHash: withdrawal.destinationTxHash,
        errorMessage: withdrawal.errorMessage,
        updatedAt: withdrawal.updatedAt,
        completedAt: withdrawal.completedAt,
      })
      .where(eq(withdrawals.id, withdrawal.id));
  }

  private toRow(withdrawal: Withdrawal) {
    return {
      id: withdrawal.id,
      publicId: withdrawal.publicId,
      userId: withdrawal.userId,
      walletId: withdrawal.walletId,
      escrowIds: withdrawal.escrowIds,
      destinationChain: withdrawal.destinationChain as number,
      destinationDomain: withdrawal.destinationDomain,
      recipientAddress: withdrawal.recipientAddress,
      status: withdrawal.status,
      estimatedAmount: String(withdrawal.estimatedAmount),
      walletProvider: withdrawal.walletProvider,
      actualAmount:
        withdrawal.actualAmount != null
          ? String(withdrawal.actualAmount)
          : null,
      fee: withdrawal.fee != null ? String(withdrawal.fee) : null,
      redeemTxHash: withdrawal.redeemTxHash,
      bridgeTxHash: withdrawal.bridgeTxHash,
      destinationTxHash: withdrawal.destinationTxHash,
      errorMessage: withdrawal.errorMessage,
      createdAt: withdrawal.createdAt,
      updatedAt: withdrawal.updatedAt,
      completedAt: withdrawal.completedAt,
    };
  }

  private toDomain(row: typeof withdrawals.$inferSelect): Withdrawal {
    return new Withdrawal({
      id: row.id,
      publicId: row.publicId,
      userId: row.userId,
      walletId: row.walletId,
      escrowIds: row.escrowIds as number[],
      destinationChain: row.destinationChain as DestinationChain,
      destinationDomain: row.destinationDomain,
      recipientAddress: row.recipientAddress,
      status: row.status as WithdrawalStatus,
      estimatedAmount: Number(row.estimatedAmount),
      walletProvider: row.walletProvider,
      actualAmount: row.actualAmount != null ? Number(row.actualAmount) : undefined,
      fee: row.fee != null ? Number(row.fee) : undefined,
      redeemTxHash: row.redeemTxHash ?? undefined,
      bridgeTxHash: row.bridgeTxHash ?? undefined,
      destinationTxHash: row.destinationTxHash ?? undefined,
      errorMessage: row.errorMessage ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      completedAt: row.completedAt ?? undefined,
    });
  }
}
