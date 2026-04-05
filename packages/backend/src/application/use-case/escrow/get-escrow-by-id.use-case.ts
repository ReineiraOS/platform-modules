import type { IEscrowRepository } from '../../../domain/escrow/repository/escrow.repository.js';
import { ApplicationHttpError } from '../../../core/errors.js';
import type { EscrowResponse } from '../../dto/escrow/escrow-response.dto.js';
import { toEscrowResponse } from './get-escrows.use-case.js';

export class GetEscrowByIdUseCase {
  constructor(private readonly escrowRepository: IEscrowRepository) {}

  async execute(publicId: string): Promise<EscrowResponse> {
    const escrow = await this.escrowRepository.findByPublicId(publicId);
    if (!escrow) {
      throw ApplicationHttpError.notFound('Escrow not found');
    }

    return toEscrowResponse(escrow);
  }
}
