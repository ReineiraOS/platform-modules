import type { IWithdrawalRepository } from '../../../domain/withdrawal/repository/withdrawal.repository.js';
import { ApplicationHttpError } from '../../../core/errors.js';

export interface BridgeChallengeResponse {
  public_id: string;
  status: string;
  actual_amount?: number;
}

export class CreateBridgeChallengeUseCase {
  constructor(private readonly withdrawalRepository: IWithdrawalRepository) {}

  async execute(publicId: string, userId: string): Promise<BridgeChallengeResponse> {
    const withdrawal = await this.withdrawalRepository.findByPublicId(publicId);
    if (!withdrawal) {
      throw ApplicationHttpError.notFound('Withdrawal not found');
    }
    if (withdrawal.userId !== userId) {
      throw ApplicationHttpError.forbidden('Withdrawal does not belong to user');
    }
    if (!withdrawal.canCreateBridgeChallenge()) {
      throw ApplicationHttpError.badRequest(`Cannot create bridge challenge in status ${withdrawal.status}`);
    }

    withdrawal.markBridgeInitiated(withdrawal.bridgeTxHash ?? '');
    await this.withdrawalRepository.update(withdrawal);

    return {
      public_id: withdrawal.publicId,
      status: withdrawal.status,
      actual_amount: withdrawal.actualAmount,
    };
  }
}
