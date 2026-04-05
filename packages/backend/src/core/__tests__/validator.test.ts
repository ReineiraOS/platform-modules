import { describe, it, expect } from 'vitest';
import { validate, ethAddressSchema, txHashSchema, ETH_ADDRESS_REGEX, TX_HASH_REGEX } from '../validator.js';
import { z } from 'zod';

describe('ETH_ADDRESS_REGEX', () => {
  it('matches a valid lowercase hex address', () => {
    expect(ETH_ADDRESS_REGEX.test('0xabcdef1234567890abcdef1234567890abcdef12')).toBe(true);
  });

  it('matches a valid uppercase hex address', () => {
    expect(ETH_ADDRESS_REGEX.test('0xABCDEF1234567890ABCDEF1234567890ABCDEF12')).toBe(true);
  });

  it('matches a valid mixed-case hex address', () => {
    expect(ETH_ADDRESS_REGEX.test('0xAbCdEf1234567890aBcDeF1234567890AbCdEf12')).toBe(true);
  });

  it('rejects an address missing 0x prefix', () => {
    expect(ETH_ADDRESS_REGEX.test('abcdef1234567890abcdef1234567890abcdef12')).toBe(false);
  });

  it('rejects an address that is too short', () => {
    expect(ETH_ADDRESS_REGEX.test('0xabcdef')).toBe(false);
  });

  it('rejects an address that is too long', () => {
    expect(ETH_ADDRESS_REGEX.test('0xabcdef1234567890abcdef1234567890abcdef1234')).toBe(false);
  });

  it('rejects an address with non-hex characters', () => {
    expect(ETH_ADDRESS_REGEX.test('0xZZZZZZ1234567890abcdef1234567890abcdef12')).toBe(false);
  });
});

describe('TX_HASH_REGEX', () => {
  it('matches a valid lowercase 64-char hex hash', () => {
    expect(TX_HASH_REGEX.test('0x' + 'a'.repeat(64))).toBe(true);
  });

  it('matches a valid uppercase 64-char hex hash', () => {
    expect(TX_HASH_REGEX.test('0x' + 'A'.repeat(64))).toBe(true);
  });

  it('matches a valid mixed-case 64-char hex hash', () => {
    expect(TX_HASH_REGEX.test('0x' + 'aAbB'.repeat(16))).toBe(true);
  });

  it('rejects a hash missing 0x prefix', () => {
    expect(TX_HASH_REGEX.test('a'.repeat(64))).toBe(false);
  });

  it('rejects a hash that is too short', () => {
    expect(TX_HASH_REGEX.test('0x' + 'a'.repeat(63))).toBe(false);
  });

  it('rejects a hash that is too long', () => {
    expect(TX_HASH_REGEX.test('0x' + 'a'.repeat(65))).toBe(false);
  });

  it('rejects a hash with non-hex characters', () => {
    expect(TX_HASH_REGEX.test('0x' + 'z'.repeat(64))).toBe(false);
  });
});

describe('ethAddressSchema', () => {
  it('parses a valid Ethereum address', () => {
    const address = '0xabcdef1234567890abcdef1234567890abcdef12';
    expect(ethAddressSchema.parse(address)).toBe(address);
  });

  it('throws for an invalid address', () => {
    expect(() => ethAddressSchema.parse('not-an-address')).toThrow();
  });

  it('throws for an address without 0x prefix', () => {
    expect(() => ethAddressSchema.parse('abcdef1234567890abcdef1234567890abcdef12')).toThrow();
  });

  it('throws for an empty string', () => {
    expect(() => ethAddressSchema.parse('')).toThrow();
  });
});

describe('txHashSchema', () => {
  it('parses a valid transaction hash', () => {
    const hash = '0x' + 'a'.repeat(64);
    expect(txHashSchema.parse(hash)).toBe(hash);
  });

  it('throws for a hash with wrong length', () => {
    expect(() => txHashSchema.parse('0x' + 'a'.repeat(63))).toThrow();
  });

  it('throws for a hash without 0x prefix', () => {
    expect(() => txHashSchema.parse('a'.repeat(64))).toThrow();
  });

  it('throws for an empty string', () => {
    expect(() => txHashSchema.parse('')).toThrow();
  });
});

describe('validate', () => {
  it('returns parsed data when schema matches', () => {
    const schema = z.object({ name: z.string(), age: z.number() });
    const result = validate(schema, { name: 'Alice', age: 30 });
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  it('coerces and transforms data per schema rules', () => {
    const schema = z.object({ value: z.string().transform((v) => v.toUpperCase()) });
    const result = validate(schema, { value: 'hello' });
    expect(result).toEqual({ value: 'HELLO' });
  });

  it('throws ZodError when data is invalid', () => {
    const schema = z.object({ name: z.string() });
    expect(() => validate(schema, { name: 123 })).toThrow();
  });

  it('throws ZodError for missing required fields', () => {
    const schema = z.object({ required: z.string() });
    expect(() => validate(schema, {})).toThrow();
  });

  it('works with primitive schemas', () => {
    expect(validate(z.string(), 'hello')).toBe('hello');
    expect(validate(z.number(), 42)).toBe(42);
  });
});
