import type { IWithdrawalRepository } from '../../../domain/withdrawal/repository/withdrawal.repository.js';
import { ApplicationHttpError } from '../../../core/errors.js';
import type { WithdrawalResponse } from '../../dto/withdrawal/withdrawal-response.dto.js';
import { toWithdrawalResponse } from './get-withdrawals.use-case.js';

export class GetWithdrawalByIdUseCase {
  constructor(private readonly withdrawalRepository: IWithdrawalRepository) {}

  async execute(publicId: string, userId: string): Promise<WithdrawalResponse> {
    const withdrawal = await this.withdrawalRepository.findByPublicId(publicId);
    if (!withdrawal) {
      throw ApplicationHttpError.notFound('Withdrawal not found');
    }
    if (withdrawal.userId !== userId) {
      throw ApplicationHttpError.forbidden('Withdrawal does not belong to user');
    }

    return toWithdrawalResponse(withdrawal);
  }
}
