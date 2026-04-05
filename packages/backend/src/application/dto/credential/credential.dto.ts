import { z } from 'zod';

export const GenerateCredentialsResponseSchema = z.object({
  client_id: z.string(),
  client_secret: z.string(),
  status: z.string(),
  created_at: z.string(),
});
export type GenerateCredentialsResponse = z.infer<typeof GenerateCredentialsResponseSchema>;

export const CredentialResponseSchema = z.object({
  client_id: z.string(),
  status: z.string(),
  created_at: z.string(),
  last_used_at: z.string().optional(),
});
export type CredentialResponse = z.infer<typeof CredentialResponseSchema>;

export const GetCredentialsResponseSchema = z.object({
  credentials: z.array(CredentialResponseSchema),
});
export type GetCredentialsResponse = z.infer<typeof GetCredentialsResponseSchema>;

export const OAuthTokenRequestSchema = z.object({
  grant_type: z.literal('client_credentials'),
  client_id: z.string().min(1),
  client_secret: z.string().min(1),
});
export type OAuthTokenRequest = z.infer<typeof OAuthTokenRequestSchema>;

export const OAuthTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number(),
});
export type OAuthTokenResponse = z.infer<typeof OAuthTokenResponseSchema>;
