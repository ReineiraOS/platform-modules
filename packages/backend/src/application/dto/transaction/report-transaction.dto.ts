import { z } from 'zod';
import { txHashSchema } from '../../../core/validator.js';

export const ReportEscrowTransactionDtoSchema = z.object({
  tx_hash: txHashSchema,
  entity_id: z.string().min(1),
});
export type ReportEscrowTransactionDto = z.infer<typeof ReportEscrowTransactionDtoSchema>;

export const ReportWithdrawalTransactionDtoSchema = z.object({
  tx_hash: txHashSchema,
  step: z.enum(['redeem', 'bridge']),
});
export type ReportWithdrawalTransactionDto = z.infer<typeof ReportWithdrawalTransactionDtoSchema>;

export const ReportTransactionResponseSchema = z.object({
  entity_id: z.string(),
  tx_hash: z.string(),
  status: z.string(),
});
export type ReportTransactionResponse = z.infer<typeof ReportTransactionResponseSchema>;
