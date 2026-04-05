import { z } from 'zod';
import { ethAddressSchema } from '../../../core/validator.js';

export const CreateWithdrawalDtoSchema = z.object({
  escrow_ids: z.array(z.number()).min(1).max(100),
  destination_chain: z.enum(['BASE', 'ETH', 'POLYGON']),
  recipient_address: ethAddressSchema,
});
export type CreateWithdrawalDto = z.infer<typeof CreateWithdrawalDtoSchema>;
