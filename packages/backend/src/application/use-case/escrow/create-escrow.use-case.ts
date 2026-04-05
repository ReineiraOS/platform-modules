import { randomUUID } from 'crypto';
import type { IFheService } from '../../../infrastructure/fhe/fhe.service.js';
import type { IEscrowRepository } from '../../../domain/escrow/repository/escrow.repository.js';
import { Escrow } from '../../../domain/escrow/model/escrow.js';
import { Currency } from '../../../domain/escrow/model/currency.js';
import { EscrowStatus } from '../../../domain/escrow/model/escrow-status.enum.js';
import { getEnv } from '../../../core/config.js';
import type { CreateEscrowDto } from '../../dto/escrow/create-escrow.dto.js';
import type { CreateEscrowResponse, CreateEscrowClientEncryptResponse } from '../../dto/escrow/escrow-response.dto.js';

export type EncryptionMode = 'server' | 'client';

const DECIMALS: Record<string, number> = {
  USDC: 6,
  USDT: 6,
  USD: 2,
  EUR: 2,
};

const DEFAULT_DECIMALS = 18;

const ABI_FUNCTION_SIGNATURE = 'createEscrow((bytes,int32,uint8,bytes),(bytes,int32,uint8,bytes),address,bytes)';

function toSmallestUnit(amount: number, currencyCode: string): bigint {
  const decimals = DECIMALS[currencyCode.toUpperCase()] ?? DEFAULT_DECIMALS;
  return BigInt(Math.round(amount * 10 ** decimals));
}

export class CreateEscrowUseCase {
  constructor(
    private readonly fheService: IFheService,
    private readonly escrowRepository: IEscrowRepository,
  ) {}

  async execute(
    dto: CreateEscrowDto,
    userId: string,
    walletAddress: string,
    encryptionMode: EncryptionMode = 'server',
  ): Promise<CreateEscrowResponse | CreateEscrowClientEncryptResponse> {
    const amountInSmallestUnit = toSmallestUnit(dto.amount, dto.currency.code);

    const escrow = new Escrow({
      id: randomUUID(),
      publicId: randomUUID(),
      userId,
      type: dto.type,
      counterparty: dto.counterparty,
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      externalReference: dto.external_reference,
      amount: dto.amount,
      currency: new Currency({ type: dto.currency.type, code: dto.currency.code }),
      status: EscrowStatus.PENDING,
      walletId: walletAddress,
      metadata: dto.metadata,
      createdAt: new Date(),
    });

    await this.escrowRepository.save(escrow);

    const contractAddress = getEnv().ESCROW_CONTRACT_ADDRESS ?? '';

    if (encryptionMode === 'client') {
      return {
        public_id: escrow.publicId,
        contract_address: contractAddress,
        abi_function_signature: ABI_FUNCTION_SIGNATURE,
        abi_parameters: {
          resolver: '0x0000000000000000000000000000000000000000',
          resolver_data: '0x',
        },
        owner_address: walletAddress,
        amount: dto.amount,
        amount_smallest_unit: amountInSmallestUnit.toString(),
      };
    }

    const encryptedData = await this.fheService.encryptEscrowData(amountInSmallestUnit, walletAddress, walletAddress);

    const abiParameters = encryptedData.getContractCallParameters();

    return {
      public_id: escrow.publicId,
      contract_address: contractAddress,
      abi_function_signature: ABI_FUNCTION_SIGNATURE,
      abi_parameters: abiParameters,
    };
  }
}
