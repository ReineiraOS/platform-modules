import type { IEscrowRepository } from '../../../domain/escrow/repository/escrow.repository.js';
import type { IEscrowEventRepository } from '../../../domain/escrow/events/repository/escrow-event.repository.js';
import { EscrowEvent, type EscrowEventType } from '../../../domain/escrow/events/model/escrow-event.js';
import { EscrowStatus } from '../../../domain/escrow/model/escrow-status.enum.js';

export interface EscrowEventPayload {
  tx_hash: string;
  escrow_id: string;
  event_type: EscrowEventType;
  block_number: string;
  message_hash?: string;
  amount?: string;
}

export class ProcessEscrowEventUseCase {
  constructor(
    private readonly escrowRepository: IEscrowRepository,
    private readonly escrowEventRepository: IEscrowEventRepository,
  ) {}

  async execute(events: EscrowEventPayload[]): Promise<void> {
    for (const event of events) {
      if (event.event_type === 'EscrowCreated') {
        await this.handleEscrowCreated(event);
      } else if (event.event_type === 'EscrowSettled') {
        await this.handleEscrowSettled(event);
      }
    }
  }

  private async handleEscrowCreated(event: EscrowEventPayload): Promise<void> {
    const escrow = await this.escrowRepository.findByTxHash(event.tx_hash);

    if (escrow && escrow.status === EscrowStatus.PROCESSING) {
      escrow.markAsOnChain();
      escrow.onChainEscrowId = event.escrow_id;
      await this.escrowRepository.update(escrow);
      return;
    }

    const bufferedEvent = new EscrowEvent({
      txHash: event.tx_hash,
      escrowId: event.escrow_id,
      eventType: event.event_type,
      blockNumber: event.block_number,
      createdAt: new Date().toISOString(),
      ttl: Math.floor(Date.now() / 1000) + 86400,
      messageHash: event.message_hash,
      amount: event.amount,
    });

    await this.escrowEventRepository.save(bufferedEvent);
  }

  private async handleEscrowSettled(event: EscrowEventPayload): Promise<void> {
    const escrow = await this.escrowRepository.findByOnChainId(event.escrow_id);

    if (escrow && escrow.status === EscrowStatus.ON_CHAIN) {
      escrow.markAsSettled();
      await this.escrowRepository.update(escrow);
    }
  }
}
