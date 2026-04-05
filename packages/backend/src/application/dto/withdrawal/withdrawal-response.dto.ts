import { z } from 'zod';

export const WithdrawalCallSchema = z.object({
  contract_address: z.string(),
  abi_function_signature: z.string(),
  abi_parameters: z.record(z.unknown()),
});
export type WithdrawalCall = z.infer<typeof WithdrawalCallSchema>;

export const CreateWithdrawalResponseSchema = z.object({
  public_id: z.string(),
  calls: z.array(WithdrawalCallSchema),
  status: z.string(),
  estimated_amount: z.number(),
});
export type CreateWithdrawalResponse = z.infer<typeof CreateWithdrawalResponseSchema>;

export const WithdrawalResponseSchema = z.object({
  public_id: z.string(),
  escrow_ids: z.array(z.number()),
  destination_chain: z.string(),
  recipient_address: z.string(),
  status: z.string(),
  estimated_amount: z.number(),
  actual_amount: z.number().optional(),
  fee: z.number().optional(),
  redeem_tx_hash: z.string().optional(),
  bridge_tx_hash: z.string().optional(),
  destination_tx_hash: z.string().optional(),
  error_message: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  completed_at: z.string().optional(),
});
export type WithdrawalResponse = z.infer<typeof WithdrawalResponseSchema>;

export const PaginatedWithdrawalsResponseSchema = z.object({
  items: z.array(WithdrawalResponseSchema),
  continuation_token: z.string().optional(),
  has_more: z.boolean(),
  limit: z.number(),
});
export type PaginatedWithdrawalsResponse = z.infer<typeof PaginatedWithdrawalsResponseSchema>;
