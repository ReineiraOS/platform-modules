import type { Withdrawal } from '../model/withdrawal.js';
import type { WithdrawalStatus } from '../model/withdrawal-status.enum.js';

export interface FindWithdrawalsByUserIdOptions {
  limit?: number;
  cursor?: string;
  status?: WithdrawalStatus;
}

export interface PaginatedResult<T> {
  items: T[];
  cursor?: string;
}

export interface IWithdrawalRepository {
  findById(id: string): Promise<Withdrawal | null>;
  findByPublicId(publicId: string): Promise<Withdrawal | null>;
  findByUserId(userId: string, options?: FindWithdrawalsByUserIdOptions): Promise<PaginatedResult<Withdrawal>>;
  save(withdrawal: Withdrawal): Promise<void>;
  update(withdrawal: Withdrawal): Promise<void>;
}
