import { describe, it, expect } from 'vitest';
import { EncryptedValue, EncryptedValueParams } from '../encrypted-value.js';

function makeEncryptedValueParams(overrides?: Partial<EncryptedValueParams>): EncryptedValueParams {
  return {
    type: 'euint64',
    data: '0xdeadbeef',
    securityZone: 0,
    utype: 5,
    inputProof: '0xproof123',
    userAddress: '0xAbCdEf1234567890abcdef1234567890abcdef12',
    ...overrides,
  };
}

describe('EncryptedValue', () => {
  describe('constructor', () => {
    it('assigns all fields', () => {
      const params = makeEncryptedValueParams();
      const ev = new EncryptedValue(params);
      expect(ev.type).toBe(params.type);
      expect(ev.data).toBe(params.data);
      expect(ev.securityZone).toBe(params.securityZone);
      expect(ev.utype).toBe(params.utype);
      expect(ev.inputProof).toBe(params.inputProof);
      expect(ev.userAddress).toBe(params.userAddress);
    });

    it('accepts all valid EncryptedValueType variants', () => {
      const euint64 = new EncryptedValue(makeEncryptedValueParams({ type: 'euint64' }));
      const eaddress = new EncryptedValue(makeEncryptedValueParams({ type: 'eaddress' }));
      const ebool = new EncryptedValue(makeEncryptedValueParams({ type: 'ebool' }));
      expect(euint64.type).toBe('euint64');
      expect(eaddress.type).toBe('eaddress');
      expect(ebool.type).toBe('ebool');
    });
  });

  describe('isForUser', () => {
    it('returns true when address matches exactly', () => {
      const address = '0xabcdef1234567890abcdef1234567890abcdef12';
      const ev = new EncryptedValue(makeEncryptedValueParams({ userAddress: address }));
      expect(ev.isForUser(address)).toBe(true);
    });

    it('returns true with case-insensitive match — stored lowercase, queried uppercase', () => {
      const ev = new EncryptedValue(
        makeEncryptedValueParams({ userAddress: '0xabcdef1234567890abcdef1234567890abcdef12' }),
      );
      expect(ev.isForUser('0xABCDEF1234567890ABCDEF1234567890ABCDEF12')).toBe(true);
    });

    it('returns true with case-insensitive match — stored uppercase, queried lowercase', () => {
      const ev = new EncryptedValue(
        makeEncryptedValueParams({ userAddress: '0xABCDEF1234567890ABCDEF1234567890ABCDEF12' }),
      );
      expect(ev.isForUser('0xabcdef1234567890abcdef1234567890abcdef12')).toBe(true);
    });

    it('returns false when address does not match', () => {
      const ev = new EncryptedValue(
        makeEncryptedValueParams({ userAddress: '0xabcdef1234567890abcdef1234567890abcdef12' }),
      );
      expect(ev.isForUser('0x1111111111111111111111111111111111111111')).toBe(false);
    });
  });

  describe('toTuple', () => {
    it('returns [data, securityZone, utype, inputProof]', () => {
      const params = makeEncryptedValueParams();
      const ev = new EncryptedValue(params);
      expect(ev.toTuple()).toEqual([params.data, params.securityZone, params.utype, params.inputProof]);
    });

    it('returns an array with exactly 4 elements', () => {
      const ev = new EncryptedValue(makeEncryptedValueParams());
      expect(ev.toTuple()).toHaveLength(4);
    });
  });

  describe('toJSON', () => {
    it('returns a plain object with all fields', () => {
      const params = makeEncryptedValueParams();
      const ev = new EncryptedValue(params);
      const json = ev.toJSON();
      expect(json).toEqual({
        type: params.type,
        data: params.data,
        securityZone: params.securityZone,
        utype: params.utype,
        inputProof: params.inputProof,
        userAddress: params.userAddress,
      });
    });
  });

  describe('fromJSON', () => {
    it('constructs an EncryptedValue from a JSON object', () => {
      const params = makeEncryptedValueParams();
      const original = new EncryptedValue(params);
      const restored = EncryptedValue.fromJSON(original.toJSON());
      expect(restored.type).toBe(params.type);
      expect(restored.data).toBe(params.data);
      expect(restored.securityZone).toBe(params.securityZone);
      expect(restored.utype).toBe(params.utype);
      expect(restored.inputProof).toBe(params.inputProof);
      expect(restored.userAddress).toBe(params.userAddress);
    });

    it('round-trips through toJSON and fromJSON producing equivalent values', () => {
      const original = new EncryptedValue(makeEncryptedValueParams());
      const restored = EncryptedValue.fromJSON(original.toJSON());
      expect(restored.toJSON()).toEqual(original.toJSON());
    });

    it('returns an instance of EncryptedValue', () => {
      const original = new EncryptedValue(makeEncryptedValueParams());
      const restored = EncryptedValue.fromJSON(original.toJSON());
      expect(restored).toBeInstanceOf(EncryptedValue);
    });
  });
});
