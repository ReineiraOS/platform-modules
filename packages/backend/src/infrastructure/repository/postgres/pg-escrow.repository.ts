import { and, eq, lt, desc } from 'drizzle-orm';
import type {
  IEscrowRepository,
  FindByUserIdOptions,
  PaginatedResult,
} from '../../../domain/escrow/repository/escrow.repository.js';
import { Escrow } from '../../../domain/escrow/model/escrow.js';
import { Currency } from '../../../domain/escrow/model/currency.js';
import { EscrowStatus } from '../../../domain/escrow/model/escrow-status.enum.js';
import { escrows } from './schema.js';
import type { Db } from './db.js';

export class PgEscrowRepository implements IEscrowRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string): Promise<Escrow | null> {
    const row = await this.db.query.escrows.findFirst({
      where: eq(escrows.id, id),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByPublicId(publicId: string): Promise<Escrow | null> {
    const row = await this.db.query.escrows.findFirst({
      where: eq(escrows.publicId, publicId),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(
    userId: string,
    options?: FindByUserIdOptions,
  ): Promise<PaginatedResult<Escrow>> {
    const limit = options?.limit ?? 20;
    const conditions = [eq(escrows.userId, userId)];

    if (options?.status) {
      conditions.push(eq(escrows.status, options.status));
    }

    if (options?.cursor) {
      const cursorRow = await this.db.query.escrows.findFirst({
        where: eq(escrows.publicId, options.cursor),
        columns: { createdAt: true },
      });
      if (cursorRow) {
        conditions.push(lt(escrows.createdAt, cursorRow.createdAt));
      }
    }

    const rows = await this.db.query.escrows.findMany({
      where: and(...conditions),
      orderBy: [desc(escrows.createdAt)],
      limit: limit + 1,
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const items = page.map((r) => this.toDomain(r));
    const nextCursor = hasMore ? page[page.length - 1]!.publicId : undefined;

    return { items, cursor: nextCursor };
  }

  async findByTxHash(txHash: string): Promise<Escrow | null> {
    const row = await this.db.query.escrows.findFirst({
      where: eq(escrows.txHash, txHash),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByOnChainId(onChainId: string): Promise<Escrow | null> {
    const row = await this.db.query.escrows.findFirst({
      where: eq(escrows.onChainEscrowId, onChainId),
    });
    return row ? this.toDomain(row) : null;
  }

  async save(escrow: Escrow): Promise<void> {
    await this.db.insert(escrows).values(this.toRow(escrow));
  }

  async update(escrow: Escrow): Promise<void> {
    await this.db
      .update(escrows)
      .set({
        status: escrow.status,
        onChainEscrowId: escrow.onChainEscrowId,
        txHash: escrow.txHash,
        metadata: escrow.metadata,
      })
      .where(eq(escrows.id, escrow.id));
  }

  private toRow(escrow: Escrow) {
    return {
      id: escrow.id,
      publicId: escrow.publicId,
      userId: escrow.userId,
      type: escrow.type,
      counterparty: escrow.counterparty,
      deadline: escrow.deadline,
      externalReference: escrow.externalReference,
      amount: String(escrow.amount),
      currencyType: escrow.currency.type,
      currencyCode: escrow.currency.code,
      status: escrow.status,
      walletId: escrow.walletId,
      metadata: escrow.metadata,
      onChainEscrowId: escrow.onChainEscrowId,
      txHash: escrow.txHash,
      createdAt: escrow.createdAt,
    };
  }

  private toDomain(row: typeof escrows.$inferSelect): Escrow {
    return new Escrow({
      id: row.id,
      publicId: row.publicId,
      userId: row.userId,
      type: row.type,
      counterparty: row.counterparty ?? undefined,
      deadline: row.deadline ?? undefined,
      externalReference: row.externalReference ?? undefined,
      amount: Number(row.amount),
      currency: new Currency({
        type: row.currencyType as 'fiat' | 'crypto',
        code: row.currencyCode,
      }),
      status: row.status as EscrowStatus,
      walletId: row.walletId,
      metadata: (row.metadata as Record<string, unknown>) ?? undefined,
      onChainEscrowId: row.onChainEscrowId ?? undefined,
      txHash: row.txHash ?? undefined,
      createdAt: row.createdAt,
    });
  }
}
