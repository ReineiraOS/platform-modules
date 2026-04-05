import { z } from 'zod';

export const BalanceResponseSchema = z.object({
  wallet_address: z.string(),
  balance: z.string(),
  formatted_balance: z.string(),
  currency: z.string(),
  chain_id: z.number(),
});
export type BalanceResponse = z.infer<typeof BalanceResponseSchema>;
