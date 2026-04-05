import { describe, it, expect } from 'vitest';
import { Withdrawal, WithdrawalParams } from '../withdrawal.js';
import { WithdrawalStatus } from '../withdrawal-status.enum.js';
import { DestinationChain } from '../destination-chain.enum.js';

function makeWithdrawalParams(overrides?: Partial<WithdrawalParams>): WithdrawalParams {
  return {
    id: 'wd-1',
    publicId: 'pub-wd-1',
    userId: 'user-1',
    walletId: 'wallet-1',
    escrowIds: [1, 2, 3],
    destinationChain: DestinationChain.BASE,
    destinationDomain: 6,
    recipientAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    status: WithdrawalStatus.PENDING_REDEEM,
    estimatedAmount: 500,
    walletProvider: 'circle',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  };
}

describe('Withdrawal', () => {
  describe('constructor', () => {
    it('assigns all required fields', () => {
      const params = makeWithdrawalParams();
      const withdrawal = new Withdrawal(params);
      expect(withdrawal.id).toBe(params.id);
      expect(withdrawal.publicId).toBe(params.publicId);
      expect(withdrawal.userId).toBe(params.userId);
      expect(withdrawal.walletId).toBe(params.walletId);
      expect(withdrawal.escrowIds).toEqual(params.escrowIds);
      expect(withdrawal.destinationChain).toBe(params.destinationChain);
      expect(withdrawal.destinationDomain).toBe(params.destinationDomain);
      expect(withdrawal.recipientAddress).toBe(params.recipientAddress);
      expect(withdrawal.status).toBe(params.status);
      expect(withdrawal.estimatedAmount).toBe(params.estimatedAmount);
      expect(withdrawal.walletProvider).toBe(params.walletProvider);
      expect(withdrawal.createdAt).toBe(params.createdAt);
      expect(withdrawal.updatedAt).toBe(params.updatedAt);
    });

    it('assigns optional fields when provided', () => {
      const params = makeWithdrawalParams({
        actualAmount: 495,
        fee: 5,
        redeemTxHash: '0x' + 'a'.repeat(64),
        bridgeTxHash: '0x' + 'b'.repeat(64),
        destinationTxHash: '0x' + 'c'.repeat(64),
        errorMessage: 'some error',
        completedAt: new Date('2025-02-01'),
      });
      const withdrawal = new Withdrawal(params);
      expect(withdrawal.actualAmount).toBe(495);
      expect(withdrawal.fee).toBe(5);
      expect(withdrawal.redeemTxHash).toBe(params.redeemTxHash);
      expect(withdrawal.bridgeTxHash).toBe(params.bridgeTxHash);
      expect(withdrawal.destinationTxHash).toBe(params.destinationTxHash);
      expect(withdrawal.errorMessage).toBe('some error');
      expect(withdrawal.completedAt).toBe(params.completedAt);
    });

    it('leaves optional fields undefined when not provided', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams());
      expect(withdrawal.actualAmount).toBeUndefined();
      expect(withdrawal.fee).toBeUndefined();
      expect(withdrawal.redeemTxHash).toBeUndefined();
      expect(withdrawal.bridgeTxHash).toBeUndefined();
      expect(withdrawal.destinationTxHash).toBeUndefined();
      expect(withdrawal.errorMessage).toBeUndefined();
      expect(withdrawal.completedAt).toBeUndefined();
    });
  });

  describe('markRedeemComplete', () => {
    it('sets redeemTxHash', () => {
      const hash = '0x' + 'a'.repeat(64);
      const withdrawal = new Withdrawal(makeWithdrawalParams());
      withdrawal.markRedeemComplete(hash);
      expect(withdrawal.redeemTxHash).toBe(hash);
    });

    it('changes status to PENDING_BRIDGE', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams());
      withdrawal.markRedeemComplete('0x' + 'a'.repeat(64));
      expect(withdrawal.status).toBe(WithdrawalStatus.PENDING_BRIDGE);
    });

    it('updates updatedAt', () => {
      const originalUpdatedAt = new Date('2025-01-01');
      const withdrawal = new Withdrawal(makeWithdrawalParams({ updatedAt: originalUpdatedAt }));
      withdrawal.markRedeemComplete('0x' + 'a'.repeat(64));
      expect(withdrawal.updatedAt).not.toBe(originalUpdatedAt);
    });

    it('returns this for chaining', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams());
      expect(withdrawal.markRedeemComplete('0x' + 'a'.repeat(64))).toBe(withdrawal);
    });
  });

  describe('markBridgeInitiated', () => {
    it('sets bridgeTxHash', () => {
      const hash = '0x' + 'b'.repeat(64);
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.PENDING_BRIDGE }));
      withdrawal.markBridgeInitiated(hash);
      expect(withdrawal.bridgeTxHash).toBe(hash);
    });

    it('changes status to BRIDGING', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.PENDING_BRIDGE }));
      withdrawal.markBridgeInitiated('0x' + 'b'.repeat(64));
      expect(withdrawal.status).toBe(WithdrawalStatus.BRIDGING);
    });

    it('updates updatedAt', () => {
      const originalUpdatedAt = new Date('2025-01-01');
      const withdrawal = new Withdrawal(
        makeWithdrawalParams({ status: WithdrawalStatus.PENDING_BRIDGE, updatedAt: originalUpdatedAt }),
      );
      withdrawal.markBridgeInitiated('0x' + 'b'.repeat(64));
      expect(withdrawal.updatedAt).not.toBe(originalUpdatedAt);
    });

    it('returns this for chaining', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.PENDING_BRIDGE }));
      expect(withdrawal.markBridgeInitiated('0x' + 'b'.repeat(64))).toBe(withdrawal);
    });
  });

  describe('markCompleted', () => {
    it('sets destinationTxHash', () => {
      const hash = '0x' + 'c'.repeat(64);
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.BRIDGING }));
      withdrawal.markCompleted(hash);
      expect(withdrawal.destinationTxHash).toBe(hash);
    });

    it('changes status to COMPLETED', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.BRIDGING }));
      withdrawal.markCompleted('0x' + 'c'.repeat(64));
      expect(withdrawal.status).toBe(WithdrawalStatus.COMPLETED);
    });

    it('sets completedAt', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.BRIDGING }));
      expect(withdrawal.completedAt).toBeUndefined();
      withdrawal.markCompleted('0x' + 'c'.repeat(64));
      expect(withdrawal.completedAt).toBeInstanceOf(Date);
    });

    it('updates updatedAt', () => {
      const originalUpdatedAt = new Date('2025-01-01');
      const withdrawal = new Withdrawal(
        makeWithdrawalParams({ status: WithdrawalStatus.BRIDGING, updatedAt: originalUpdatedAt }),
      );
      withdrawal.markCompleted('0x' + 'c'.repeat(64));
      expect(withdrawal.updatedAt).not.toBe(originalUpdatedAt);
    });

    it('returns this for chaining', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.BRIDGING }));
      expect(withdrawal.markCompleted('0x' + 'c'.repeat(64))).toBe(withdrawal);
    });
  });

  describe('markFailed', () => {
    it('sets errorMessage', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams());
      withdrawal.markFailed('bridge timeout');
      expect(withdrawal.errorMessage).toBe('bridge timeout');
    });

    it('changes status to FAILED', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams());
      withdrawal.markFailed('bridge timeout');
      expect(withdrawal.status).toBe(WithdrawalStatus.FAILED);
    });

    it('updates updatedAt', () => {
      const originalUpdatedAt = new Date('2025-01-01');
      const withdrawal = new Withdrawal(makeWithdrawalParams({ updatedAt: originalUpdatedAt }));
      withdrawal.markFailed('error');
      expect(withdrawal.updatedAt).not.toBe(originalUpdatedAt);
    });

    it('returns this for chaining', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams());
      expect(withdrawal.markFailed('error')).toBe(withdrawal);
    });
  });

  describe('canCreateBridgeChallenge', () => {
    it('returns true when status is PENDING_BRIDGE', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.PENDING_BRIDGE }));
      expect(withdrawal.canCreateBridgeChallenge()).toBe(true);
    });

    it('returns false when status is PENDING_REDEEM', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.PENDING_REDEEM }));
      expect(withdrawal.canCreateBridgeChallenge()).toBe(false);
    });

    it('returns false when status is BRIDGING', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.BRIDGING }));
      expect(withdrawal.canCreateBridgeChallenge()).toBe(false);
    });

    it('returns false when status is COMPLETED', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.COMPLETED }));
      expect(withdrawal.canCreateBridgeChallenge()).toBe(false);
    });

    it('returns false when status is FAILED', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.FAILED }));
      expect(withdrawal.canCreateBridgeChallenge()).toBe(false);
    });
  });

  describe('isTerminal', () => {
    it('returns true when status is COMPLETED', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.COMPLETED }));
      expect(withdrawal.isTerminal()).toBe(true);
    });

    it('returns true when status is FAILED', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.FAILED }));
      expect(withdrawal.isTerminal()).toBe(true);
    });

    it('returns false when status is PENDING_REDEEM', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.PENDING_REDEEM }));
      expect(withdrawal.isTerminal()).toBe(false);
    });

    it('returns false when status is PENDING_BRIDGE', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.PENDING_BRIDGE }));
      expect(withdrawal.isTerminal()).toBe(false);
    });

    it('returns false when status is BRIDGING', () => {
      const withdrawal = new Withdrawal(makeWithdrawalParams({ status: WithdrawalStatus.BRIDGING }));
      expect(withdrawal.isTerminal()).toBe(false);
    });
  });
});
