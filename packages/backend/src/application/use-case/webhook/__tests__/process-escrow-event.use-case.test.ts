import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';
import { ProcessEscrowEventUseCase } from '../process-escrow-event.use-case.js';
import { MemoryEscrowRepository } from '../../../../infrastructure/repository/memory/memory-escrow.repository.js';
import { MemoryEscrowEventRepository } from '../../../../infrastructure/repository/memory/memory-escrow-event.repository.js';
import { Escrow } from '../../../../domain/escrow/model/escrow.js';
import { Currency } from '../../../../domain/escrow/model/currency.js';
import { EscrowStatus } from '../../../../domain/escrow/model/escrow-status.enum.js';

const TX_HASH = '0xabc123txhash';
const ESCROW_ID = 'escrow-42';

function makeEscrow(status: EscrowStatus, txHash?: string, onChainId?: string): Escrow {
  return new Escrow({
    id: randomUUID(),
    publicId: randomUUID(),
    userId: randomUUID(),
    type: 'payment',
    amount: 100,
    currency: new Currency({ type: 'crypto', code: 'USDC' }),
    status,
    walletId: '0xwallet',
    txHash,
    onChainEscrowId: onChainId,
    createdAt: new Date(),
  });
}

describe('ProcessEscrowEventUseCase', () => {
  let useCase: ProcessEscrowEventUseCase;
  let escrowRepo: MemoryEscrowRepository;
  let escrowEventRepo: MemoryEscrowEventRepository;

  beforeEach(() => {
    escrowRepo = new MemoryEscrowRepository();
    escrowEventRepo = new MemoryEscrowEventRepository();
    useCase = new ProcessEscrowEventUseCase(escrowRepo, escrowEventRepo);
  });

  describe('EscrowCreated event', () => {
    it('updates a PROCESSING escrow to ON_CHAIN and sets onChainEscrowId', async () => {
      const escrow = makeEscrow(EscrowStatus.PROCESSING, TX_HASH);
      await escrowRepo.save(escrow);

      await useCase.execute([
        { tx_hash: TX_HASH, escrow_id: ESCROW_ID, event_type: 'EscrowCreated', block_number: '100' },
      ]);

      const updated = await escrowRepo.findByTxHash(TX_HASH);
      expect(updated!.status).toBe(EscrowStatus.ON_CHAIN);
      expect(updated!.onChainEscrowId).toBe(ESCROW_ID);
    });

    it('does not update an escrow that is not in PROCESSING status', async () => {
      const escrow = makeEscrow(EscrowStatus.PENDING, TX_HASH);
      await escrowRepo.save(escrow);

      await useCase.execute([
        { tx_hash: TX_HASH, escrow_id: ESCROW_ID, event_type: 'EscrowCreated', block_number: '100' },
      ]);

      const notUpdated = await escrowRepo.findByTxHash(TX_HASH);
      expect(notUpdated!.status).toBe(EscrowStatus.PENDING);
    });

    it('buffers the event when no matching escrow is found', async () => {
      await useCase.execute([
        { tx_hash: TX_HASH, escrow_id: ESCROW_ID, event_type: 'EscrowCreated', block_number: '100' },
      ]);

      const buffered = await escrowEventRepo.findByTxHash(TX_HASH);
      expect(buffered).not.toBeNull();
      expect(buffered!.escrowId).toBe(ESCROW_ID);
      expect(buffered!.eventType).toBe('EscrowCreated');
    });

    it('buffers event when escrow exists but is not PROCESSING', async () => {
      const escrow = makeEscrow(EscrowStatus.ON_CHAIN, TX_HASH);
      await escrowRepo.save(escrow);

      await useCase.execute([
        { tx_hash: TX_HASH, escrow_id: ESCROW_ID, event_type: 'EscrowCreated', block_number: '100' },
      ]);

      const buffered = await escrowEventRepo.findByTxHash(TX_HASH);
      expect(buffered).not.toBeNull();
    });
  });

  describe('EscrowSettled event', () => {
    it('updates an ON_CHAIN escrow to SETTLED', async () => {
      const escrow = makeEscrow(EscrowStatus.ON_CHAIN, undefined, ESCROW_ID);
      await escrowRepo.save(escrow);

      await useCase.execute([
        { tx_hash: TX_HASH, escrow_id: ESCROW_ID, event_type: 'EscrowSettled', block_number: '200' },
      ]);

      const updated = await escrowRepo.findByOnChainId(ESCROW_ID);
      expect(updated!.status).toBe(EscrowStatus.SETTLED);
    });

    it('does nothing when no escrow matches the escrow_id', async () => {
      await useCase.execute([
        { tx_hash: TX_HASH, escrow_id: 'unknown-escrow', event_type: 'EscrowSettled', block_number: '200' },
      ]);
    });

    it('does not update escrow that is not in ON_CHAIN status', async () => {
      const escrow = makeEscrow(EscrowStatus.SETTLED, undefined, ESCROW_ID);
      await escrowRepo.save(escrow);

      await useCase.execute([
        { tx_hash: TX_HASH, escrow_id: ESCROW_ID, event_type: 'EscrowSettled', block_number: '200' },
      ]);

      const unchanged = await escrowRepo.findByOnChainId(ESCROW_ID);
      expect(unchanged!.status).toBe(EscrowStatus.SETTLED);
    });
  });

  it('processes multiple events in sequence', async () => {
    const esc1 = makeEscrow(EscrowStatus.PROCESSING, '0xtx1');
    const esc2 = makeEscrow(EscrowStatus.ON_CHAIN, undefined, 'esc-2');
    await escrowRepo.save(esc1);
    await escrowRepo.save(esc2);

    await useCase.execute([
      { tx_hash: '0xtx1', escrow_id: 'esc-1', event_type: 'EscrowCreated', block_number: '100' },
      { tx_hash: '0xtx2', escrow_id: 'esc-2', event_type: 'EscrowSettled', block_number: '101' },
    ]);

    const updated1 = await escrowRepo.findByTxHash('0xtx1');
    expect(updated1!.status).toBe(EscrowStatus.ON_CHAIN);

    const updated2 = await escrowRepo.findByOnChainId('esc-2');
    expect(updated2!.status).toBe(EscrowStatus.SETTLED);
  });
});
