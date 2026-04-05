import type { IEscrowRepository, FindByUserIdOptions } from '../../../domain/escrow/repository/escrow.repository.js';
import type { Escrow } from '../../../domain/escrow/model/escrow.js';
import type { EscrowResponse, PaginatedEscrowsResponse } from '../../dto/escrow/escrow-response.dto.js';

const DEFAULT_LIMIT = 20;

function toEscrowResponse(escrow: Escrow): EscrowResponse {
  return {
    public_id: escrow.publicId,
    type: escrow.type,
    counterparty: escrow.counterparty,
    deadline: escrow.deadline?.toISOString().split('T')[0]!,
    external_reference: escrow.externalReference,
    amount: escrow.amount,
    currency: { type: escrow.currency.type, code: escrow.currency.code },
    status: escrow.status,
    on_chain_id: escrow.onChainEscrowId,
    tx_hash: escrow.txHash,
    metadata: escrow.metadata,
    created_at: escrow.createdAt.toISOString(),
  };
}

export { toEscrowResponse };

export class GetEscrowsUseCase {
  constructor(private readonly escrowRepository: IEscrowRepository) {}

  async execute(
    userId: string,
    options?: { limit?: number; cursor?: string; status?: string },
  ): Promise<PaginatedEscrowsResponse> {
    const limit = options?.limit ?? DEFAULT_LIMIT;

    const findOptions: FindByUserIdOptions = {
      limit: limit + 1,
      cursor: options?.cursor,
      status: options?.status as FindByUserIdOptions['status'],
    };

    const result = await this.escrowRepository.findByUserId(userId, findOptions);
    const hasMore = result.items.length > limit;
    const items = hasMore ? result.items.slice(0, limit) : result.items;

    return {
      items: items.map(toEscrowResponse),
      continuation_token: hasMore ? result.cursor : undefined,
      has_more: hasMore,
      limit,
    };
  }
}
