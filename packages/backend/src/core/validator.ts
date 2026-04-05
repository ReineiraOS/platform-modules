import { z } from 'zod';

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
export const TX_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/;

export const ethAddressSchema = z.string().regex(ETH_ADDRESS_REGEX, 'Invalid Ethereum address');
export const txHashSchema = z.string().regex(TX_HASH_REGEX, 'Invalid transaction hash');
