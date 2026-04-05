import type { IEscrowRepository } from '../../../domain/escrow/repository/escrow.repository.js';
import type { IEscrowEventRepository } from '../../../domain/escrow/events/repository/escrow-event.repository.js';
import { ApplicationHttpError } from '../../../core/errors.js';
import type {
  ReportEscrowTransactionDto,
  ReportTransactionResponse,
} from '../../dto/transaction/report-transaction.dto.js';

export class ReportEscrowTransactionUseCase {
  constructor(
    private readonly escrowRepository: IEscrowRepository,
    private readonly escrowEventRepository: IEscrowEventRepository,
  ) {}

  async execute(dto: ReportEscrowTransactionDto, userId: string): Promise<ReportTransactionResponse> {
    const escrow = await this.escrowRepository.findByPublicId(dto.entity_id);
    if (!escrow) {
      throw ApplicationHttpError.notFound('Escrow not found');
    }
    if (escrow.userId !== userId) {
      throw ApplicationHttpError.forbidden('Escrow does not belong to user');
    }

    escrow.markAsProcessing();
    escrow.txHash = dto.tx_hash;

    const bufferedEvent = await this.escrowEventRepository.findByTxHash(dto.tx_hash);
    if (bufferedEvent && bufferedEvent.eventType === 'EscrowCreated') {
      escrow.markAsOnChain();
      escrow.onChainEscrowId = bufferedEvent.escrowId;
      await this.escrowEventRepository.delete(bufferedEvent.txHash);
    }

    await this.escrowRepository.update(escrow);

    return {
      entity_id: escrow.publicId,
      tx_hash: dto.tx_hash,
      status: escrow.status,
    };
  }
}
