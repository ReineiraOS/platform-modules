import { z } from 'zod';

export const AbiParametersSchema = z.object({
  encrypted_owner: z.tuple([z.string(), z.number(), z.number(), z.string()]),
  encrypted_amount: z.tuple([z.string(), z.number(), z.number(), z.string()]),
  resolver: z.string(),
  resolver_data: z.string(),
});
export type AbiParameters = z.infer<typeof AbiParametersSchema>;

export const CreateEscrowResponseSchema = z.object({
  public_id: z.string(),
  contract_address: z.string(),
  abi_function_signature: z.string(),
  abi_parameters: AbiParametersSchema,
});
export type CreateEscrowResponse = z.infer<typeof CreateEscrowResponseSchema>;

export const CreateEscrowClientEncryptResponseSchema = z.object({
  public_id: z.string(),
  contract_address: z.string(),
  abi_function_signature: z.string(),
  abi_parameters: z.object({
    resolver: z.string(),
    resolver_data: z.string(),
  }),
  owner_address: z.string(),
  amount: z.number(),
  amount_smallest_unit: z.string(),
});
export type CreateEscrowClientEncryptResponse = z.infer<typeof CreateEscrowClientEncryptResponseSchema>;

export const EscrowResponseSchema = z.object({
  public_id: z.string(),
  type: z.string(),
  counterparty: z.string().optional(),
  deadline: z.string().optional(),
  external_reference: z.string().optional(),
  amount: z.number(),
  currency: z.object({
    type: z.enum(['fiat', 'crypto']),
    code: z.string(),
  }),
  status: z.string(),
  on_chain_id: z.string().optional(),
  tx_hash: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.string(),
});
export type EscrowResponse = z.infer<typeof EscrowResponseSchema>;

export const PaginatedEscrowsResponseSchema = z.object({
  items: z.array(EscrowResponseSchema),
  continuation_token: z.string().optional(),
  has_more: z.boolean(),
  limit: z.number(),
});
export type PaginatedEscrowsResponse = z.infer<typeof PaginatedEscrowsResponseSchema>;

export const PublicEscrowResponseSchema = z.object({
  public_id: z.string(),
  on_chain_id: z.string().optional(),
  type: z.string(),
  counterparty: z.string().optional(),
  deadline: z.string().optional(),
  external_reference: z.string().optional(),
  amount: z.number(),
  currency: z.object({
    type: z.enum(['fiat', 'crypto']),
    code: z.string(),
  }),
  status: z.string(),
  destination_chain_id: z.number(),
  escrow_contract: z.string(),
});
export type PublicEscrowResponse = z.infer<typeof PublicEscrowResponseSchema>;
