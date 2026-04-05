import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';
import { CreateEscrowUseCase } from '../create-escrow.use-case.js';
import { MemoryEscrowRepository } from '../../../../infrastructure/repository/memory/memory-escrow.repository.js';
import { EncryptedEscrowData } from '../../../../domain/fhe/model/encrypted-escrow-data.js';
import { EncryptedValue } from '../../../../domain/fhe/model/encrypted-value.js';
import { EscrowStatus } from '../../../../domain/escrow/model/escrow-status.enum.js';
import type { IFheService } from '../../../../infrastructure/fhe/fhe.service.js';
import type { CreateEscrowDto } from '../../../dto/escrow/create-escrow.dto.js';
import type {
  CreateEscrowResponse,
  CreateEscrowClientEncryptResponse,
} from '../../../dto/escrow/escrow-response.dto.js';

const USER_ID = randomUUID();
const WALLET = '0xabc123walletaddress';
const ESCROW_CONTRACT = '0xescrowcontract';

function makeFakeEncryptedValue(type: 'euint64' | 'eaddress'): EncryptedValue {
  return new EncryptedValue({
    type,
    data: `0xfakedata_${type}`,
    securityZone: 0,
    utype: type === 'euint64' ? 4 : 12,
    inputProof: `0xfakeproof_${type}`,
    userAddress: WALLET,
  });
}

function makeFakeEncryptedEscrowData(): EncryptedEscrowData {
  return new EncryptedEscrowData({
    encryptedAmount: makeFakeEncryptedValue('euint64'),
    encryptedOwner: makeFakeEncryptedValue('eaddress'),
    userAddress: WALLET,
    plaintextAmount: BigInt(100_000_000),
    plaintextOwner: WALLET,
  });
}

function makeMockFheService(): IFheService {
  return {
    encryptEscrowData: async () => makeFakeEncryptedEscrowData(),
  };
}

function makeCreateEscrowDto(overrides: Partial<CreateEscrowDto> = {}): CreateEscrowDto {
  return {
    type: 'payment',
    amount: 100,
    currency: { type: 'crypto', code: 'USDC' },
    ...overrides,
  };
}

describe('CreateEscrowUseCase', () => {
  let useCase: CreateEscrowUseCase;
  let escrowRepo: MemoryEscrowRepository;
  let fheService: IFheService;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-chars-long';
    process.env.JWT_ISSUER = 'test-issuer';
    process.env.ESCROW_CONTRACT_ADDRESS = ESCROW_CONTRACT;

    escrowRepo = new MemoryEscrowRepository();
    fheService = makeMockFheService();
    useCase = new CreateEscrowUseCase(fheService, escrowRepo);
  });

  it('returns encrypted abi_parameters in server mode', async () => {
    const result = (await useCase.execute(makeCreateEscrowDto(), USER_ID, WALLET, 'server')) as CreateEscrowResponse;

    expect(result.abi_parameters).toHaveProperty('encrypted_owner');
    expect(result.abi_parameters).toHaveProperty('encrypted_amount');
    expect(result.abi_parameters).toHaveProperty('resolver');
    expect(result.abi_parameters).toHaveProperty('resolver_data');
  });

  it('does not return owner_address or amount in server mode', async () => {
    const result = await useCase.execute(makeCreateEscrowDto(), USER_ID, WALLET, 'server');

    expect(result).not.toHaveProperty('owner_address');
    expect(result).not.toHaveProperty('amount_smallest_unit');
  });

  it('returns plaintext owner_address and amount in client mode', async () => {
    const result = (await useCase.execute(
      makeCreateEscrowDto(),
      USER_ID,
      WALLET,
      'client',
    )) as CreateEscrowClientEncryptResponse;

    expect(result.owner_address).toBe(WALLET);
    expect(result.amount).toBe(100);
  });

  it('does not call fheService in client mode', async () => {
    let called = false;
    fheService = {
      encryptEscrowData: async () => {
        called = true;
        return makeFakeEncryptedEscrowData();
      },
    };
    useCase = new CreateEscrowUseCase(fheService, escrowRepo);

    await useCase.execute(makeCreateEscrowDto(), USER_ID, WALLET, 'client');

    expect(called).toBe(false);
  });

  it('converts 100 USDC to "100000000" in client mode', async () => {
    const result = (await useCase.execute(
      makeCreateEscrowDto({ amount: 100, currency: { type: 'crypto', code: 'USDC' } }),
      USER_ID,
      WALLET,
      'client',
    )) as CreateEscrowClientEncryptResponse;

    expect(result.amount_smallest_unit).toBe('100000000');
  });

  it('converts fractional USDC amount correctly to smallest unit in client mode', async () => {
    const result = (await useCase.execute(
      makeCreateEscrowDto({ amount: 1.5, currency: { type: 'crypto', code: 'USDC' } }),
      USER_ID,
      WALLET,
      'client',
    )) as CreateEscrowClientEncryptResponse;

    expect(result.amount_smallest_unit).toBe('1500000');
  });

  it('saves escrow to repository with PENDING status', async () => {
    const result = (await useCase.execute(makeCreateEscrowDto(), USER_ID, WALLET)) as CreateEscrowResponse;

    const saved = await escrowRepo.findByPublicId(result.public_id);
    expect(saved).not.toBeNull();
    expect(saved!.status).toBe(EscrowStatus.PENDING);
  });

  it('saves escrow to repository with correct userId', async () => {
    const result = (await useCase.execute(makeCreateEscrowDto(), USER_ID, WALLET)) as CreateEscrowResponse;

    const saved = await escrowRepo.findByPublicId(result.public_id);
    expect(saved!.userId).toBe(USER_ID);
  });

  it('saves escrow with the provided amount and currency', async () => {
    const dto = makeCreateEscrowDto({ amount: 250, currency: { type: 'crypto', code: 'USDC' } });

    const result = (await useCase.execute(dto, USER_ID, WALLET)) as CreateEscrowResponse;

    const saved = await escrowRepo.findByPublicId(result.public_id);
    expect(saved!.amount).toBe(250);
    expect(saved!.currency.code).toBe('USDC');
  });

  it('returns ESCROW_CONTRACT_ADDRESS as contract_address in server mode', async () => {
    const result = (await useCase.execute(makeCreateEscrowDto(), USER_ID, WALLET, 'server')) as CreateEscrowResponse;

    expect(result.contract_address).toBe(ESCROW_CONTRACT);
  });

  it('returns ESCROW_CONTRACT_ADDRESS as contract_address in client mode', async () => {
    const result = (await useCase.execute(
      makeCreateEscrowDto(),
      USER_ID,
      WALLET,
      'client',
    )) as CreateEscrowClientEncryptResponse;

    expect(result.contract_address).toBe(ESCROW_CONTRACT);
  });

  it('returns the correct abi_function_signature', async () => {
    const result = (await useCase.execute(makeCreateEscrowDto(), USER_ID, WALLET)) as CreateEscrowResponse;

    expect(result.abi_function_signature).toBe(
      'createEscrow((bytes,int32,uint8,bytes),(bytes,int32,uint8,bytes),address,bytes)',
    );
  });

  it('encrypted_owner and encrypted_amount are tuples of correct shape', async () => {
    const result = (await useCase.execute(makeCreateEscrowDto(), USER_ID, WALLET, 'server')) as CreateEscrowResponse;

    const { encrypted_owner, encrypted_amount } = result.abi_parameters;

    expect(Array.isArray(encrypted_owner)).toBe(true);
    expect(encrypted_owner).toHaveLength(4);
    expect(typeof encrypted_owner[0]).toBe('string');
    expect(typeof encrypted_owner[1]).toBe('number');
    expect(typeof encrypted_owner[2]).toBe('number');
    expect(typeof encrypted_owner[3]).toBe('string');

    expect(Array.isArray(encrypted_amount)).toBe(true);
    expect(encrypted_amount).toHaveLength(4);
  });

  it('uses server mode by default when encryptionMode is omitted', async () => {
    const result = await useCase.execute(makeCreateEscrowDto(), USER_ID, WALLET);

    expect(result).toHaveProperty('abi_parameters');
    expect((result as CreateEscrowResponse).abi_parameters).toHaveProperty('encrypted_owner');
  });
});
