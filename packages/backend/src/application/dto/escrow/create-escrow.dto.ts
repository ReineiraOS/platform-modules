import { z } from 'zod';

export const CreateEscrowDtoSchema = z.object({
  type: z.string().min(1),
  counterparty: z.string().min(1).optional(),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  external_reference: z.string().min(1).optional(),
  amount: z.number().positive(),
  currency: z.object({
    type: z.enum(['fiat', 'crypto']),
    code: z.string().min(1),
  }),
  metadata: z.record(z.unknown()).optional(),
});
export type CreateEscrowDto = z.infer<typeof CreateEscrowDtoSchema>;
