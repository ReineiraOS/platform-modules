import type { IWithdrawalRepository } from '../../../domain/withdrawal/repository/withdrawal.repository.js';
import { ApplicationHttpError } from '../../../core/errors.js';
import { WithdrawalStatus } from '../../../domain/withdrawal/model/withdrawal-status.enum.js';

export interface BridgeReadinessResponse {
  public_id: string;
  ready: boolean;
  status: string;
}

export class CheckBridgeReadinessUseCase {
  constructor(private readonly withdrawalRepository: IWithdrawalRepository) {}

  async execute(publicId: string, userId: string): Promise<BridgeReadinessResponse> {
    const withdrawal = await this.withdrawalRepository.findByPublicId(publicId);
    if (!withdrawal) {
      throw ApplicationHttpError.notFound('Withdrawal not found');
    }
    if (withdrawal.userId !== userId) {
      throw ApplicationHttpError.forbidden('Withdrawal does not belong to user');
    }

    const ready = withdrawal.status === WithdrawalStatus.PENDING_BRIDGE;

    return {
      public_id: withdrawal.publicId,
      ready,
      status: withdrawal.status,
    };
  }
}
