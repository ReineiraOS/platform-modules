import { z } from 'zod';
import { ethAddressSchema } from '@core/validator';

export const RequestNonceDtoSchema = z.object({
  wallet_address: ethAddressSchema,
});
export type RequestNonceDto = z.infer<typeof RequestNonceDtoSchema>;

export const RequestNonceResponseSchema = z.object({
  nonce: z.string(),
});
export type RequestNonceResponse = z.infer<typeof RequestNonceResponseSchema>;
