import { describe, it, expect } from 'vitest';
import { EncryptedEscrowData, EncryptedEscrowDataParams } from '../encrypted-escrow-data.js';
import { EncryptedValue } from '../encrypted-value.js';

function makeEncryptedValue(userAddress: string, data = '0xdata'): EncryptedValue {
  return new EncryptedValue({
    type: 'euint64',
    data,
    securityZone: 0,
    utype: 5,
    inputProof: '0xproof',
    userAddress,
  });
}

function makeEncryptedEscrowDataParams(overrides?: Partial<EncryptedEscrowDataParams>): EncryptedEscrowDataParams {
  const userAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
  return {
    encryptedAmount: makeEncryptedValue(userAddress, '0xamount'),
    encryptedOwner: makeEncryptedValue(userAddress, '0xowner'),
    userAddress,
    ...overrides,
  };
}

describe('EncryptedEscrowData', () => {
  describe('constructor', () => {
    it('assigns all required fields', () => {
      const params = makeEncryptedEscrowDataParams();
      const eid = new EncryptedEscrowData(params);
      expect(eid.encryptedAmount).toBe(params.encryptedAmount);
      expect(eid.encryptedOwner).toBe(params.encryptedOwner);
      expect(eid.userAddress).toBe(params.userAddress);
    });

    it('assigns optional plaintextAmount when provided', () => {
      const eid = new EncryptedEscrowData(makeEncryptedEscrowDataParams({ plaintextAmount: BigInt(1000) }));
      expect(eid.plaintextAmount).toBe(BigInt(1000));
    });

    it('assigns optional plaintextOwner when provided', () => {
      const eid = new EncryptedEscrowData(makeEncryptedEscrowDataParams({ plaintextOwner: '0xowner' }));
      expect(eid.plaintextOwner).toBe('0xowner');
    });

    it('leaves optional fields undefined when not provided', () => {
      const eid = new EncryptedEscrowData(makeEncryptedEscrowDataParams());
      expect(eid.plaintextAmount).toBeUndefined();
      expect(eid.plaintextOwner).toBeUndefined();
    });
  });

  describe('isForUser', () => {
    it('returns true when address matches exactly', () => {
      const address = '0xabcdef1234567890abcdef1234567890abcdef12';
      const eid = new EncryptedEscrowData(makeEncryptedEscrowDataParams({ userAddress: address }));
      expect(eid.isForUser(address)).toBe(true);
    });

    it('returns true with case-insensitive match', () => {
      const eid = new EncryptedEscrowData(
        makeEncryptedEscrowDataParams({
          userAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        }),
      );
      expect(eid.isForUser('0xABCDEF1234567890ABCDEF1234567890ABCDEF12')).toBe(true);
    });

    it('returns false when address does not match', () => {
      const eid = new EncryptedEscrowData(
        makeEncryptedEscrowDataParams({
          userAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        }),
      );
      expect(eid.isForUser('0x1111111111111111111111111111111111111111')).toBe(false);
    });
  });

  describe('getContractCallParameters', () => {
    it('returns encrypted_owner tuple from encryptedOwner', () => {
      const params = makeEncryptedEscrowDataParams();
      const eid = new EncryptedEscrowData(params);
      const result = eid.getContractCallParameters();
      expect(result.encrypted_owner).toEqual(params.encryptedOwner.toTuple());
    });

    it('returns encrypted_amount tuple from encryptedAmount', () => {
      const params = makeEncryptedEscrowDataParams();
      const eid = new EncryptedEscrowData(params);
      const result = eid.getContractCallParameters();
      expect(result.encrypted_amount).toEqual(params.encryptedAmount.toTuple());
    });

    it('returns zero address as resolver', () => {
      const eid = new EncryptedEscrowData(makeEncryptedEscrowDataParams());
      const result = eid.getContractCallParameters();
      expect(result.resolver).toBe('0x0000000000000000000000000000000000000000');
    });

    it('returns 0x as resolver_data', () => {
      const eid = new EncryptedEscrowData(makeEncryptedEscrowDataParams());
      const result = eid.getContractCallParameters();
      expect(result.resolver_data).toBe('0x');
    });
  });

  describe('toJSON', () => {
    it('serializes all fields to a plain object', () => {
      const params = makeEncryptedEscrowDataParams({
        plaintextAmount: BigInt(500),
        plaintextOwner: '0xowner',
      });
      const eid = new EncryptedEscrowData(params);
      const json = eid.toJSON();
      expect(json.userAddress).toBe(params.userAddress);
      expect(json.encryptedAmount).toEqual(params.encryptedAmount.toJSON());
      expect(json.encryptedOwner).toEqual(params.encryptedOwner.toJSON());
      expect(json.plaintextAmount).toBe('500');
      expect(json.plaintextOwner).toBe('0xowner');
    });

    it('omits plaintextAmount in JSON when undefined', () => {
      const eid = new EncryptedEscrowData(makeEncryptedEscrowDataParams());
      const json = eid.toJSON();
      expect(json.plaintextAmount).toBeUndefined();
    });

    it('omits plaintextOwner in JSON when undefined', () => {
      const eid = new EncryptedEscrowData(makeEncryptedEscrowDataParams());
      const json = eid.toJSON();
      expect(json.plaintextOwner).toBeUndefined();
    });
  });

  describe('fromJSON', () => {
    it('restores an EncryptedEscrowData from JSON', () => {
      const params = makeEncryptedEscrowDataParams({ plaintextAmount: BigInt(999) });
      const original = new EncryptedEscrowData(params);
      const restored = EncryptedEscrowData.fromJSON(original.toJSON());
      expect(restored).toBeInstanceOf(EncryptedEscrowData);
      expect(restored.userAddress).toBe(params.userAddress);
      expect(restored.plaintextAmount).toBe(BigInt(999));
    });

    it('restores plaintextOwner from JSON', () => {
      const params = makeEncryptedEscrowDataParams({ plaintextOwner: '0xsome-owner' });
      const original = new EncryptedEscrowData(params);
      const restored = EncryptedEscrowData.fromJSON(original.toJSON());
      expect(restored.plaintextOwner).toBe('0xsome-owner');
    });

    it('leaves plaintextAmount undefined when not present in JSON', () => {
      const original = new EncryptedEscrowData(makeEncryptedEscrowDataParams());
      const restored = EncryptedEscrowData.fromJSON(original.toJSON());
      expect(restored.plaintextAmount).toBeUndefined();
    });

    it('round-trips through toJSON and fromJSON', () => {
      const params = makeEncryptedEscrowDataParams({ plaintextAmount: BigInt(42) });
      const original = new EncryptedEscrowData(params);
      const restored = EncryptedEscrowData.fromJSON(original.toJSON());
      expect(restored.toJSON()).toEqual(original.toJSON());
    });

    it('restores nested EncryptedValue instances', () => {
      const original = new EncryptedEscrowData(makeEncryptedEscrowDataParams());
      const restored = EncryptedEscrowData.fromJSON(original.toJSON());
      expect(restored.encryptedAmount).toBeInstanceOf(EncryptedValue);
      expect(restored.encryptedOwner).toBeInstanceOf(EncryptedValue);
    });
  });
});
