import type { IEscrowRepository } from '../../../domain/escrow/repository/escrow.repository.js';
import { ApplicationHttpError } from '../../../core/errors.js';
import { getEnv } from '../../../core/config.js';
import { DestinationChain } from '../../../domain/withdrawal/model/destination-chain.enum.js';
import type { PublicEscrowResponse } from '../../dto/escrow/escrow-response.dto.js';

export class GetPublicEscrowUseCase {
  constructor(private readonly escrowRepository: IEscrowRepository) {}

  async execute(publicId: string): Promise<PublicEscrowResponse> {
    const escrow = await this.escrowRepository.findByPublicId(publicId);
    if (!escrow) {
      throw ApplicationHttpError.notFound('Escrow not found');
    }

    return {
      public_id: escrow.publicId,
      on_chain_id: escrow.onChainEscrowId,
      type: escrow.type,
      counterparty: escrow.counterparty,
      deadline: escrow.deadline?.toISOString().split('T')[0]!,
      external_reference: escrow.externalReference,
      amount: escrow.amount,
      currency: { type: escrow.currency.type, code: escrow.currency.code },
      status: escrow.status,
      destination_chain_id: DestinationChain.BASE,
      escrow_contract: getEnv().ESCROW_CONTRACT_ADDRESS ?? '',
    };
  }
}
