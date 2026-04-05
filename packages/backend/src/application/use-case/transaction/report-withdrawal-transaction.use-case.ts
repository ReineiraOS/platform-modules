import type { IWithdrawalRepository } from '../../../domain/withdrawal/repository/withdrawal.repository.js';
import { ApplicationHttpError } from '../../../core/errors.js';
import type { ReportWithdrawalTransactionDto } from '../../dto/transaction/report-transaction.dto.js';

export interface ReportWithdrawalTransactionResponse {
  tx_hash: string;
  step: string;
  status: string;
}

export class ReportWithdrawalTransactionUseCase {
  constructor(private readonly withdrawalRepository: IWithdrawalRepository) {}

  async execute(
    dto: ReportWithdrawalTransactionDto,
    userId: string,
    publicId: string,
  ): Promise<ReportWithdrawalTransactionResponse> {
    const withdrawal = await this.withdrawalRepository.findByPublicId(publicId);
    if (!withdrawal) {
      throw ApplicationHttpError.notFound('Withdrawal not found');
    }
    if (withdrawal.userId !== userId) {
      throw ApplicationHttpError.forbidden('Withdrawal does not belong to user');
    }

    if (dto.step === 'redeem') {
      withdrawal.markRedeemComplete(dto.tx_hash);
    } else {
      withdrawal.markBridgeInitiated(dto.tx_hash);
    }

    await this.withdrawalRepository.update(withdrawal);

    return {
      tx_hash: dto.tx_hash,
      step: dto.step,
      status: withdrawal.status,
    };
  }
}
