import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';
import { ReportEscrowTransactionUseCase } from '../report-escrow-transaction.use-case.js';
import { MemoryEscrowRepository } from '../../../../infrastructure/repository/memory/memory-escrow.repository.js';
import { MemoryEscrowEventRepository } from '../../../../infrastructure/repository/memory/memory-escrow-event.repository.js';
import { Escrow } from '../../../../domain/escrow/model/escrow.js';
import { Currency } from '../../../../domain/escrow/model/currency.js';
import { EscrowStatus } from '../../../../domain/escrow/model/escrow-status.enum.js';
import { EscrowEvent } from '../../../../domain/escrow/events/model/escrow-event.js';
import { ApplicationHttpError } from '../../../../core/errors.js';

const USER_ID = randomUUID();
const TX_HASH = '0xtxhash123';

function makeEscrow(userId = USER_ID): Escrow {
  return new Escrow({
    id: randomUUID(),
    publicId: randomUUID(),
    userId,
    type: 'payment',
    amount: 150,
    currency: new Currency({ type: 'crypto', code: 'USDC' }),
    status: EscrowStatus.PENDING,
    walletId: '0xwallet',
    createdAt: new Date(),
  });
}

describe('ReportEscrowTransactionUseCase', () => {
  let useCase: ReportEscrowTransactionUseCase;
  let escrowRepo: MemoryEscrowRepository;
  let escrowEventRepo: MemoryEscrowEventRepository;

  beforeEach(() => {
    escrowRepo = new MemoryEscrowRepository();
    escrowEventRepo = new MemoryEscrowEventRepository();
    useCase = new ReportEscrowTransactionUseCase(escrowRepo, escrowEventRepo);
  });

  it('marks escrow as PROCESSING and stores the tx_hash', async () => {
    const escrow = makeEscrow();
    await escrowRepo.save(escrow);

    const result = await useCase.execute({ entity_id: escrow.publicId, tx_hash: TX_HASH }, USER_ID);

    expect(result.tx_hash).toBe(TX_HASH);
    expect(result.status).toBe(EscrowStatus.PROCESSING);
    expect(result.entity_id).toBe(escrow.publicId);
  });

  it('reconciles with a buffered EscrowCreated event — escrow becomes ON_CHAIN', async () => {
    const escrow = makeEscrow();
    await escrowRepo.save(escrow);

    const bufferedEvent = new EscrowEvent({
      txHash: TX_HASH,
      escrowId: '99',
      eventType: 'EscrowCreated',
      blockNumber: '200',
      createdAt: new Date().toISOString(),
      ttl: Math.floor(Date.now() / 1000) + 86400,
    });
    await escrowEventRepo.save(bufferedEvent);

    const result = await useCase.execute({ entity_id: escrow.publicId, tx_hash: TX_HASH }, USER_ID);

    expect(result.status).toBe(EscrowStatus.ON_CHAIN);

    const updated = await escrowRepo.findByPublicId(escrow.publicId);
    expect(updated!.onChainEscrowId).toBe('99');
  });

  it('deletes the buffered event after reconciliation', async () => {
    const escrow = makeEscrow();
    await escrowRepo.save(escrow);

    await escrowEventRepo.save(
      new EscrowEvent({
        txHash: TX_HASH,
        escrowId: '55',
        eventType: 'EscrowCreated',
        blockNumber: '100',
        createdAt: new Date().toISOString(),
        ttl: Math.floor(Date.now() / 1000) + 86400,
      }),
    );

    await useCase.execute({ entity_id: escrow.publicId, tx_hash: TX_HASH }, USER_ID);

    expect(await escrowEventRepo.findByTxHash(TX_HASH)).toBeNull();
  });

  it('does not reconcile if buffered event is not EscrowCreated type', async () => {
    const escrow = makeEscrow();
    await escrowRepo.save(escrow);

    await escrowEventRepo.save(
      new EscrowEvent({
        txHash: TX_HASH,
        escrowId: '77',
        eventType: 'EscrowSettled',
        blockNumber: '100',
        createdAt: new Date().toISOString(),
        ttl: Math.floor(Date.now() / 1000) + 86400,
      }),
    );

    const result = await useCase.execute({ entity_id: escrow.publicId, tx_hash: TX_HASH }, USER_ID);

    expect(result.status).toBe(EscrowStatus.PROCESSING);
  });

  it('throws 404 when escrow is not found', async () => {
    await expect(useCase.execute({ entity_id: 'nonexistent', tx_hash: TX_HASH }, USER_ID)).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('throws 403 when escrow belongs to a different user', async () => {
    const escrow = makeEscrow(randomUUID());
    await escrowRepo.save(escrow);

    await expect(useCase.execute({ entity_id: escrow.publicId, tx_hash: TX_HASH }, USER_ID)).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it('throws ApplicationHttpError for missing escrow', async () => {
    await expect(useCase.execute({ entity_id: 'missing', tx_hash: TX_HASH }, USER_ID)).rejects.toBeInstanceOf(
      ApplicationHttpError,
    );
  });
});
