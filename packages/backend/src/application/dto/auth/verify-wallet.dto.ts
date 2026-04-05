import { z } from 'zod';
import { ethAddressSchema } from '../../../core/validator.js';

export const VerifyWalletDtoSchema = z.object({
  wallet_address: ethAddressSchema,
  message: z.string().min(1),
  signature: z.string().regex(/^0x/, 'Signature must start with 0x'),
  email: z.string().email().optional(),
});
export type VerifyWalletDto = z.infer<typeof VerifyWalletDtoSchema>;

export const TokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number(),
});
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
