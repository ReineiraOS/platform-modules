import { randomUUID } from 'crypto';
import type { IEscrowRepository } from '../../../domain/escrow/repository/escrow.repository.js';
import type { IWithdrawalRepository } from '../../../domain/withdrawal/repository/withdrawal.repository.js';
import { EscrowStatus } from '../../../domain/escrow/model/escrow-status.enum.js';
import { Withdrawal } from '../../../domain/withdrawal/model/withdrawal.js';
import { DestinationChain } from '../../../domain/withdrawal/model/destination-chain.enum.js';
import { WithdrawalStatus } from '../../../domain/withdrawal/model/withdrawal-status.enum.js';
import { ApplicationHttpError } from '../../../core/errors.js';
import { getEnv } from '../../../core/config.js';
import type { CreateWithdrawalDto } from '../../dto/withdrawal/create-withdrawal.dto.js';
import type { CreateWithdrawalResponse } from '../../dto/withdrawal/withdrawal-response.dto.js';

const CHAIN_TO_DESTINATION: Record<string, DestinationChain> = {
  ETH: DestinationChain.ETH,
  BASE: DestinationChain.BASE,
  POLYGON: DestinationChain.POLYGON,
};

function generatePublicId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = 'WD-';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export class CreateWithdrawalUseCase {
  constructor(
    private readonly escrowRepository: IEscrowRepository,
    private readonly withdrawalRepository: IWithdrawalRepository,
  ) {}

  async execute(dto: CreateWithdrawalDto, userId: string, walletAddress: string): Promise<CreateWithdrawalResponse> {
    let estimatedAmount = 0;
    const onChainIds: number[] = [];

    for (const escrowId of dto.escrow_ids) {
      const escrow = await this.escrowRepository.findByOnChainId(String(escrowId));
      if (!escrow) {
        throw ApplicationHttpError.notFound(`Escrow with on-chain ID ${escrowId} not found`);
      }
      if (escrow.userId !== userId) {
        throw ApplicationHttpError.forbidden('Escrow does not belong to user');
      }
      if (escrow.status !== EscrowStatus.SETTLED) {
        throw ApplicationHttpError.badRequest(`Escrow ${escrowId} is not in SETTLED status`);
      }
      estimatedAmount += escrow.amount;
      onChainIds.push(escrowId);
    }

    const destinationChain = CHAIN_TO_DESTINATION[dto.destination_chain]!;
    const publicId = generatePublicId();
    const now = new Date();

    const withdrawal = new Withdrawal({
      id: randomUUID(),
      publicId,
      userId,
      walletId: walletAddress,
      escrowIds: onChainIds,
      destinationChain,
      destinationDomain: destinationChain as number,
      recipientAddress: dto.recipient_address,
      status: WithdrawalStatus.PENDING_REDEEM,
      estimatedAmount,
      walletProvider: 'walletconnect',
      createdAt: now,
      updatedAt: now,
    });

    await this.withdrawalRepository.save(withdrawal);

    const escrowContract = getEnv().ESCROW_CONTRACT_ADDRESS ?? '';

    return {
      public_id: publicId,
      calls: [
        {
          contract_address: escrowContract,
          abi_function_signature: 'redeemMultiple(uint256[])',
          abi_parameters: { escrow_ids: onChainIds },
        },
        {
          contract_address: getEnv().PUSDC_WRAPPER_ADDRESS ?? '',
          abi_function_signature: 'unwrap(uint256)',
          abi_parameters: { amount: estimatedAmount },
        },
      ],
      status: withdrawal.status,
      estimated_amount: estimatedAmount,
    };
  }
}
