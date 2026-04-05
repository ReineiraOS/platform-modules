import type { IWithdrawalRepository } from '../../../domain/withdrawal/repository/withdrawal.repository.js';

export class RelayCallbackUseCase {
  constructor(private readonly withdrawalRepository: IWithdrawalRepository) {}

  async execute(payload: unknown): Promise<void> {
    const data = payload as { withdrawal_id?: string; status?: string; tx_hash?: string; error?: string };
    if (!data.withdrawal_id) {
      return;
    }

    const withdrawal = await this.withdrawalRepository.findByPublicId(data.withdrawal_id);
    if (!withdrawal) {
      return;
    }

    if (data.status === 'completed' && data.tx_hash) {
      withdrawal.markCompleted(data.tx_hash);
    } else if (data.status === 'failed') {
      withdrawal.markFailed(data.error ?? 'Relay callback reported failure');
    }

    await this.withdrawalRepository.update(withdrawal);
  }
}
