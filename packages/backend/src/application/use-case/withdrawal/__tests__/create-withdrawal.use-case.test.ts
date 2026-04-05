import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';
import { CreateWithdrawalUseCase } from '../create-withdrawal.use-case.js';
import { MemoryEscrowRepository } from '../../../../infrastructure/repository/memory/memory-escrow.repository.js';
import { MemoryWithdrawalRepository } from '../../../../infrastructure/repository/memory/memory-withdrawal.repository.js';
import { Escrow } from '../../../../domain/escrow/model/escrow.js';
import { Currency } from '../../../../domain/escrow/model/currency.js';
import { EscrowStatus } from '../../../../domain/escrow/model/escrow-status.enum.js';
import { WithdrawalStatus } from '../../../../domain/withdrawal/model/withdrawal-status.enum.js';
import { ApplicationHttpError } from '../../../../core/errors.js';

const USER_ID = randomUUID();
const WALLET = '0xuser';
const RECIPIENT = '0xrecipient';

function makeSettledEscrow(onChainId: string, userId = USER_ID): Escrow {
  return new Escrow({
    id: randomUUID(),
    publicId: randomUUID(),
    userId,
    type: 'payment',
    amount: 100,
    currency: new Currency({ type: 'crypto', code: 'USDC' }),
    status: EscrowStatus.SETTLED,
    walletId: WALLET,
    onChainEscrowId: onChainId,
    createdAt: new Date(),
  });
}

describe('CreateWithdrawalUseCase', () => {
  let useCase: CreateWithdrawalUseCase;
  let escrowRepo: MemoryEscrowRepository;
  let withdrawalRepo: MemoryWithdrawalRepository;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-chars-long';
    process.env.JWT_ISSUER = 'test-issuer';
    process.env.ESCROW_CONTRACT_ADDRESS = '0xescrow';
    process.env.PUSDC_WRAPPER_ADDRESS = '0xwrapper';

    escrowRepo = new MemoryEscrowRepository();
    withdrawalRepo = new MemoryWithdrawalRepository();
    useCase = new CreateWithdrawalUseCase(escrowRepo, withdrawalRepo);
  });

  it('creates a withdrawal with PENDING_REDEEM status', async () => {
    await escrowRepo.save(makeSettledEscrow('1'));

    const result = await useCase.execute(
      { escrow_ids: [1], destination_chain: 'ETH', recipient_address: RECIPIENT },
      USER_ID,
      WALLET,
    );

    expect(result.status).toBe(WithdrawalStatus.PENDING_REDEEM);
    expect(result.public_id).toMatch(/^WD-/);
  });

  it('returns calls array with redeemMultiple and unwrap', async () => {
    await escrowRepo.save(makeSettledEscrow('1'));

    const result = await useCase.execute(
      { escrow_ids: [1], destination_chain: 'ETH', recipient_address: RECIPIENT },
      USER_ID,
      WALLET,
    );

    expect(result.calls).toHaveLength(2);
    expect(result.calls[0]!.abi_function_signature).toBe('redeemMultiple(uint256[])');
    expect(result.calls[1]!.abi_function_signature).toBe('unwrap(uint256)');
  });

  it('sums estimated amount from multiple escrows', async () => {
    const esc1 = makeSettledEscrow('10');
    const esc2 = new Escrow({
      ...esc1,
      id: randomUUID(),
      publicId: randomUUID(),
      onChainEscrowId: '11',
      amount: 200,
    });
    await escrowRepo.save(esc1);
    await escrowRepo.save(esc2);

    const result = await useCase.execute(
      { escrow_ids: [10, 11], destination_chain: 'BASE', recipient_address: RECIPIENT },
      USER_ID,
      WALLET,
    );

    expect(result.estimated_amount).toBe(300);
  });

  it('rejects with 404 if escrow on-chain id is not found', async () => {
    await expect(
      useCase.execute({ escrow_ids: [999], destination_chain: 'ETH', recipient_address: RECIPIENT }, USER_ID, WALLET),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it('rejects with 400 if escrow is not in SETTLED status', async () => {
    const escrow = new Escrow({
      id: randomUUID(),
      publicId: randomUUID(),
      userId: USER_ID,
      type: 'payment',
      amount: 100,
      currency: new Currency({ type: 'crypto', code: 'USDC' }),
      status: EscrowStatus.ON_CHAIN,
      walletId: WALLET,
      onChainEscrowId: '5',
      createdAt: new Date(),
    });
    await escrowRepo.save(escrow);

    await expect(
      useCase.execute({ escrow_ids: [5], destination_chain: 'ETH', recipient_address: RECIPIENT }, USER_ID, WALLET),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('rejects with 403 if escrow belongs to a different user', async () => {
    await escrowRepo.save(makeSettledEscrow('7', randomUUID()));

    await expect(
      useCase.execute({ escrow_ids: [7], destination_chain: 'ETH', recipient_address: RECIPIENT }, USER_ID, WALLET),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it('saves the withdrawal to the repository', async () => {
    await escrowRepo.save(makeSettledEscrow('20'));

    const result = await useCase.execute(
      { escrow_ids: [20], destination_chain: 'ETH', recipient_address: RECIPIENT },
      USER_ID,
      WALLET,
    );

    const saved = await withdrawalRepo.findByPublicId(result.public_id);
    expect(saved).not.toBeNull();
  });

  it('rejects with ApplicationHttpError for missing escrow', async () => {
    await expect(
      useCase.execute({ escrow_ids: [404], destination_chain: 'ETH', recipient_address: RECIPIENT }, USER_ID, WALLET),
    ).rejects.toBeInstanceOf(ApplicationHttpError);
  });
});
