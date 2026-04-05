import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';
import { MemoryUserRepository } from '../memory-user.repository.js';
import { MemorySessionRepository } from '../memory-session.repository.js';
import { MemoryEscrowRepository } from '../memory-escrow.repository.js';
import { MemoryWithdrawalRepository } from '../memory-withdrawal.repository.js';
import { MemoryBusinessProfileRepository } from '../memory-business-profile.repository.js';
import { MemoryApiCredentialRepository } from '../memory-api-credential.repository.js';
import { MemoryEscrowEventRepository } from '../memory-escrow-event.repository.js';
import { MemoryNonceRepository } from '../memory-nonce.repository.js';
import { User } from '../../../../domain/auth/model/user.js';
import { Session } from '../../../../domain/auth/model/session.js';
import { Escrow } from '../../../../domain/escrow/model/escrow.js';
import { Currency } from '../../../../domain/escrow/model/currency.js';
import { EscrowStatus } from '../../../../domain/escrow/model/escrow-status.enum.js';
import { Withdrawal } from '../../../../domain/withdrawal/model/withdrawal.js';
import { WithdrawalStatus } from '../../../../domain/withdrawal/model/withdrawal-status.enum.js';
import { DestinationChain } from '../../../../domain/withdrawal/model/destination-chain.enum.js';
import { BusinessProfile } from '../../../../domain/business-profile/model/business-profile.js';
import { ApiCredential } from '../../../../domain/api-credential/model/api-credential.js';
import { EscrowEvent } from '../../../../domain/escrow/events/model/escrow-event.js';

function makeUser(overrides: Partial<ConstructorParameters<typeof User>[0]> = {}): User {
  return new User({
    id: randomUUID(),
    walletAddress: `0x${randomUUID().replace(/-/g, '')}`,
    walletProvider: 'walletconnect',
    createdAt: new Date(),
    ...overrides,
  });
}

function makeSession(userId: string, overrides: Partial<ConstructorParameters<typeof Session>[0]> = {}): Session {
  return new Session({
    id: randomUUID(),
    userId,
    refreshToken: randomUUID(),
    expiresAt: new Date(Date.now() + 60000),
    createdAt: new Date(),
    ...overrides,
  });
}

function makeEscrow(userId: string, overrides: Partial<ConstructorParameters<typeof Escrow>[0]> = {}): Escrow {
  return new Escrow({
    id: randomUUID(),
    publicId: randomUUID(),
    userId,
    type: 'payment',
    amount: 100,
    currency: new Currency({ type: 'fiat', code: 'USD' }),
    status: EscrowStatus.PENDING,
    walletId: '0xabc',
    createdAt: new Date(),
    ...overrides,
  });
}

function makeWithdrawal(
  userId: string,
  overrides: Partial<ConstructorParameters<typeof Withdrawal>[0]> = {},
): Withdrawal {
  return new Withdrawal({
    id: randomUUID(),
    publicId: `WD-${randomUUID().slice(0, 8).toUpperCase()}`,
    userId,
    walletId: '0xabc',
    escrowIds: [1, 2],
    destinationChain: DestinationChain.ETH,
    destinationDomain: 0,
    recipientAddress: '0xrecipient',
    status: WithdrawalStatus.PENDING_REDEEM,
    estimatedAmount: 200,
    walletProvider: 'walletconnect',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });
}

describe('MemoryUserRepository', () => {
  let repo: MemoryUserRepository;

  beforeEach(() => {
    repo = new MemoryUserRepository();
  });

  it('save and findById returns the saved user', async () => {
    const user = makeUser();
    await repo.save(user);
    const found = await repo.findById(user.id);
    expect(found).toEqual(user);
  });

  it('findById returns null for unknown id', async () => {
    expect(await repo.findById('nope')).toBeNull();
  });

  it('findByWalletAddress returns matching user', async () => {
    const user = makeUser({ walletAddress: '0xunique' });
    await repo.save(user);
    const found = await repo.findByWalletAddress('0xunique');
    expect(found?.id).toBe(user.id);
  });

  it('findByWalletAddress returns null when not found', async () => {
    expect(await repo.findByWalletAddress('0xmissing')).toBeNull();
  });
});

describe('MemorySessionRepository', () => {
  let repo: MemorySessionRepository;
  const userId = randomUUID();

  beforeEach(() => {
    repo = new MemorySessionRepository();
  });

  it('save and findById returns session', async () => {
    const session = makeSession(userId);
    await repo.save(session);
    expect(await repo.findById(session.id)).toEqual(session);
  });

  it('findById returns null for unknown id', async () => {
    expect(await repo.findById('nope')).toBeNull();
  });

  it('findByRefreshToken returns matching session', async () => {
    const session = makeSession(userId, { refreshToken: 'special-token' });
    await repo.save(session);
    const found = await repo.findByRefreshToken('special-token');
    expect(found?.id).toBe(session.id);
  });

  it('findByRefreshToken returns null when not found', async () => {
    expect(await repo.findByRefreshToken('missing')).toBeNull();
  });

  it('findByUserId returns all sessions for a user', async () => {
    const s1 = makeSession(userId);
    const s2 = makeSession(userId);
    const other = makeSession(randomUUID());
    await repo.save(s1);
    await repo.save(s2);
    await repo.save(other);
    const sessions = await repo.findByUserId(userId);
    expect(sessions).toHaveLength(2);
  });

  it('delete removes a session by id', async () => {
    const session = makeSession(userId);
    await repo.save(session);
    await repo.delete(session.id);
    expect(await repo.findById(session.id)).toBeNull();
  });

  it('deleteByUserId removes all sessions for the user', async () => {
    const s1 = makeSession(userId);
    const s2 = makeSession(userId);
    await repo.save(s1);
    await repo.save(s2);
    await repo.deleteByUserId(userId);
    expect(await repo.findByUserId(userId)).toHaveLength(0);
  });
});

describe('MemoryEscrowRepository', () => {
  let repo: MemoryEscrowRepository;
  const userId = randomUUID();

  beforeEach(() => {
    repo = new MemoryEscrowRepository();
  });

  it('save and findById returns escrow', async () => {
    const escrow = makeEscrow(userId);
    await repo.save(escrow);
    expect(await repo.findById(escrow.id)).toEqual(escrow);
  });

  it('findByPublicId returns matching escrow', async () => {
    const escrow = makeEscrow(userId);
    await repo.save(escrow);
    expect(await repo.findByPublicId(escrow.publicId)).toEqual(escrow);
  });

  it('findByPublicId returns null when not found', async () => {
    expect(await repo.findByPublicId('missing')).toBeNull();
  });

  it('update persists changes', async () => {
    const escrow = makeEscrow(userId);
    await repo.save(escrow);
    escrow.markAsOnChain();
    await repo.update(escrow);
    const updated = await repo.findById(escrow.id);
    expect(updated?.status).toBe(EscrowStatus.ON_CHAIN);
  });

  it('findByUserId returns escrows for user sorted by createdAt desc', async () => {
    const i1 = makeEscrow(userId, { createdAt: new Date('2024-01-01') });
    const i2 = makeEscrow(userId, { createdAt: new Date('2024-06-01') });
    await repo.save(i1);
    await repo.save(i2);
    const result = await repo.findByUserId(userId);
    expect(result.items[0]!.id).toBe(i2.id);
    expect(result.items[1]!.id).toBe(i1.id);
  });

  it('findByUserId filters by status', async () => {
    const pending = makeEscrow(userId, { status: EscrowStatus.PENDING });
    const settled = makeEscrow(userId, { status: EscrowStatus.SETTLED });
    await repo.save(pending);
    await repo.save(settled);
    const result = await repo.findByUserId(userId, { status: EscrowStatus.SETTLED });
    expect(result.items).toHaveLength(1);
    expect(result.items[0]!.status).toBe(EscrowStatus.SETTLED);
  });

  it('findByUserId respects limit and returns cursor when has_more', async () => {
    for (let i = 0; i < 5; i++) {
      await repo.save(makeEscrow(userId, { createdAt: new Date(2024, i, 1) }));
    }
    const result = await repo.findByUserId(userId, { limit: 3 });
    expect(result.items).toHaveLength(3);
    expect(result.cursor).toBeDefined();
  });

  it('findByUserId uses cursor to paginate', async () => {
    const escrows: Escrow[] = [];
    for (let i = 0; i < 4; i++) {
      const esc = makeEscrow(userId, { createdAt: new Date(2024, 3 - i, 1) });
      escrows.push(esc);
      await repo.save(esc);
    }
    const first = await repo.findByUserId(userId, { limit: 2 });
    const second = await repo.findByUserId(userId, { limit: 2, cursor: first.cursor });
    expect(second.items).toHaveLength(2);
    expect(second.items[0]!.id).not.toBe(first.items[0]!.id);
  });

  it('findByTxHash returns matching escrow', async () => {
    const escrow = makeEscrow(userId, { txHash: '0xtxhash' });
    await repo.save(escrow);
    expect(await repo.findByTxHash('0xtxhash')).toEqual(escrow);
  });

  it('findByTxHash returns null when not found', async () => {
    expect(await repo.findByTxHash('0xmissing')).toBeNull();
  });

  it('findByOnChainId returns matching escrow', async () => {
    const escrow = makeEscrow(userId, { onChainEscrowId: '42' });
    await repo.save(escrow);
    expect(await repo.findByOnChainId('42')).toEqual(escrow);
  });

  it('findByOnChainId returns null when not found', async () => {
    expect(await repo.findByOnChainId('999')).toBeNull();
  });
});

describe('MemoryWithdrawalRepository', () => {
  let repo: MemoryWithdrawalRepository;
  const userId = randomUUID();

  beforeEach(() => {
    repo = new MemoryWithdrawalRepository();
  });

  it('save and findById returns withdrawal', async () => {
    const w = makeWithdrawal(userId);
    await repo.save(w);
    expect(await repo.findById(w.id)).toEqual(w);
  });

  it('findByPublicId returns matching withdrawal', async () => {
    const w = makeWithdrawal(userId);
    await repo.save(w);
    expect(await repo.findByPublicId(w.publicId)).toEqual(w);
  });

  it('findByPublicId returns null when not found', async () => {
    expect(await repo.findByPublicId('WD-MISSING')).toBeNull();
  });

  it('update persists status changes', async () => {
    const w = makeWithdrawal(userId);
    await repo.save(w);
    w.markRedeemComplete('0xtx');
    await repo.update(w);
    const updated = await repo.findById(w.id);
    expect(updated?.status).toBe(WithdrawalStatus.PENDING_BRIDGE);
  });

  it('findByUserId returns paginated withdrawals', async () => {
    for (let i = 0; i < 5; i++) {
      await repo.save(makeWithdrawal(userId, { createdAt: new Date(2024, i, 1) }));
    }
    const result = await repo.findByUserId(userId, { limit: 3 });
    expect(result.items).toHaveLength(3);
    expect(result.cursor).toBeDefined();
  });

  it('findByUserId filters by status', async () => {
    const pending = makeWithdrawal(userId, { status: WithdrawalStatus.PENDING_REDEEM });
    const completed = makeWithdrawal(userId, { status: WithdrawalStatus.COMPLETED });
    await repo.save(pending);
    await repo.save(completed);
    const result = await repo.findByUserId(userId, { status: WithdrawalStatus.COMPLETED });
    expect(result.items).toHaveLength(1);
  });
});

describe('MemoryBusinessProfileRepository', () => {
  let repo: MemoryBusinessProfileRepository;

  beforeEach(() => {
    repo = new MemoryBusinessProfileRepository();
  });

  it('save and findByUserId returns profile', async () => {
    const userId = randomUUID();
    const profile = new BusinessProfile({
      id: randomUUID(),
      userId,
      businessName: 'Acme',
      businessType: 'RETAIL',
    });
    await repo.save(profile);
    expect(await repo.findByUserId(userId)).toEqual(profile);
  });

  it('findByUserId returns null when not found', async () => {
    expect(await repo.findByUserId('nobody')).toBeNull();
  });
});

describe('MemoryApiCredentialRepository', () => {
  let repo: MemoryApiCredentialRepository;

  beforeEach(() => {
    repo = new MemoryApiCredentialRepository();
  });

  function makeCredential(userId: string): ApiCredential {
    return new ApiCredential({
      id: randomUUID(),
      clientId: `rc_${randomUUID().replace(/-/g, '').slice(0, 24)}`,
      userId,
      hashedSecret: 'hash',
      salt: 'salt',
      status: 'active',
      createdAt: new Date(),
    });
  }

  it('save and findByClientId returns credential', async () => {
    const credential = makeCredential('user-1');
    await repo.save(credential);
    expect(await repo.findByClientId(credential.clientId)).toEqual(credential);
  });

  it('findByClientId returns null when not found', async () => {
    expect(await repo.findByClientId('rc_missing')).toBeNull();
  });

  it('findByUserId returns all credentials for user', async () => {
    const userId = randomUUID();
    await repo.save(makeCredential(userId));
    await repo.save(makeCredential(userId));
    await repo.save(makeCredential(randomUUID()));
    const results = await repo.findByUserId(userId);
    expect(results).toHaveLength(2);
  });

  it('update persists status change', async () => {
    const credential = makeCredential('user-1');
    await repo.save(credential);
    credential.revoke();
    await repo.update(credential);
    const updated = await repo.findByClientId(credential.clientId);
    expect(updated?.status).toBe('revoked');
  });
});

describe('MemoryEscrowEventRepository', () => {
  let repo: MemoryEscrowEventRepository;

  beforeEach(() => {
    repo = new MemoryEscrowEventRepository();
  });

  function makeEvent(txHash: string, escrowId: string): EscrowEvent {
    return new EscrowEvent({
      txHash,
      escrowId,
      eventType: 'EscrowCreated',
      blockNumber: '100',
      createdAt: new Date().toISOString(),
      ttl: Math.floor(Date.now() / 1000) + 86400,
    });
  }

  it('save and findByTxHash returns event', async () => {
    const event = makeEvent('0xtx1', 'escrow-1');
    await repo.save(event);
    expect(await repo.findByTxHash('0xtx1')).toEqual(event);
  });

  it('findByTxHash returns null when not found', async () => {
    expect(await repo.findByTxHash('0xmissing')).toBeNull();
  });

  it('findByEscrowId returns matching event', async () => {
    const event = makeEvent('0xtx2', 'escrow-999');
    await repo.save(event);
    expect(await repo.findByEscrowId('escrow-999')).toEqual(event);
  });

  it('findByEscrowId returns null when not found', async () => {
    expect(await repo.findByEscrowId('nope')).toBeNull();
  });

  it('delete removes event by txHash', async () => {
    const event = makeEvent('0xtx3', 'escrow-3');
    await repo.save(event);
    await repo.delete('0xtx3');
    expect(await repo.findByTxHash('0xtx3')).toBeNull();
  });
});

describe('MemoryNonceRepository', () => {
  let repo: MemoryNonceRepository;

  beforeEach(() => {
    repo = new MemoryNonceRepository();
  });

  it('save and findAndDelete returns true for valid entry', async () => {
    await repo.save('0xwallet', 'mynonce', 300);
    expect(await repo.findAndDelete('0xwallet', 'mynonce')).toBe(true);
  });

  it('findAndDelete returns false after nonce is consumed', async () => {
    await repo.save('0xwallet', 'mynonce', 300);
    await repo.findAndDelete('0xwallet', 'mynonce');
    expect(await repo.findAndDelete('0xwallet', 'mynonce')).toBe(false);
  });

  it('findAndDelete returns false for unknown nonce', async () => {
    expect(await repo.findAndDelete('0xwallet', 'unknown')).toBe(false);
  });

  it('findAndDelete returns false for expired nonce', async () => {
    await repo.save('0xwallet', 'expired', -1);
    expect(await repo.findAndDelete('0xwallet', 'expired')).toBe(false);
  });
});
