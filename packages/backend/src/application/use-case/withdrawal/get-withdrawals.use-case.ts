import type {
  IWithdrawalRepository,
  FindWithdrawalsByUserIdOptions,
} from '../../../domain/withdrawal/repository/withdrawal.repository.js';
import type { Withdrawal } from '../../../domain/withdrawal/model/withdrawal.js';
import type { WithdrawalResponse, PaginatedWithdrawalsResponse } from '../../dto/withdrawal/withdrawal-response.dto.js';

const DEFAULT_LIMIT = 20;

function toWithdrawalResponse(w: Withdrawal): WithdrawalResponse {
  return {
    public_id: w.publicId,
    escrow_ids: w.escrowIds,
    destination_chain: w.destinationChain.toString(),
    recipient_address: w.recipientAddress,
    status: w.status,
    estimated_amount: w.estimatedAmount,
    actual_amount: w.actualAmount,
    fee: w.fee,
    redeem_tx_hash: w.redeemTxHash,
    bridge_tx_hash: w.bridgeTxHash,
    destination_tx_hash: w.destinationTxHash,
    error_message: w.errorMessage,
    created_at: w.createdAt.toISOString(),
    updated_at: w.updatedAt.toISOString(),
    completed_at: w.completedAt?.toISOString(),
  };
}

export { toWithdrawalResponse };

export class GetWithdrawalsUseCase {
  constructor(private readonly withdrawalRepository: IWithdrawalRepository) {}

  async execute(
    userId: string,
    options?: { limit?: number; cursor?: string; status?: string },
  ): Promise<PaginatedWithdrawalsResponse> {
    const limit = options?.limit ?? DEFAULT_LIMIT;

    const findOptions: FindWithdrawalsByUserIdOptions = {
      limit: limit + 1,
      cursor: options?.cursor,
      status: options?.status as FindWithdrawalsByUserIdOptions['status'],
    };

    const result = await this.withdrawalRepository.findByUserId(userId, findOptions);
    const hasMore = result.items.length > limit;
    const items = hasMore ? result.items.slice(0, limit) : result.items;

    return {
      items: items.map(toWithdrawalResponse),
      continuation_token: hasMore ? result.cursor : undefined,
      has_more: hasMore,
      limit,
    };
  }
}
