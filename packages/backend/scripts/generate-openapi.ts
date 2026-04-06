import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { extendZodWithOpenApi, createDocument } from 'zod-openapi';

extendZodWithOpenApi(z);

import { RequestNonceDtoSchema, RequestNonceResponseSchema } from '../src/application/dto/auth/request-nonce.dto';
import { VerifyWalletDtoSchema, TokenResponseSchema } from '../src/application/dto/auth/verify-wallet.dto';
import { RefreshTokenDtoSchema } from '../src/application/dto/auth/refresh-token.dto';
import { BalanceResponseSchema } from '../src/application/dto/balance/balance-response.dto';
import {
  CreateBusinessProfileDtoSchema,
  BusinessProfileResponseSchema,
} from '../src/application/dto/business-profile/create-business-profile.dto';
import {
  GenerateCredentialsResponseSchema,
  GetCredentialsResponseSchema,
  OAuthTokenRequestSchema,
  OAuthTokenResponseSchema,
} from '../src/application/dto/credential/credential.dto';
import { CreateEscrowDtoSchema } from '../src/application/dto/escrow/create-escrow.dto';
import {
  CreateEscrowResponseSchema,
  EscrowResponseSchema,
  PaginatedEscrowsResponseSchema,
  PublicEscrowResponseSchema,
} from '../src/application/dto/escrow/escrow-response.dto';
import {
  ReportEscrowTransactionDtoSchema,
  ReportWithdrawalTransactionDtoSchema,
  ReportTransactionResponseSchema,
} from '../src/application/dto/transaction/report-transaction.dto';
import { CreateWithdrawalDtoSchema } from '../src/application/dto/withdrawal/create-withdrawal.dto';
import {
  CreateWithdrawalResponseSchema,
  WithdrawalResponseSchema,
  PaginatedWithdrawalsResponseSchema,
} from '../src/application/dto/withdrawal/withdrawal-response.dto';

const UserResponseSchema = z.object({
  id: z.string(),
  wallet_address: z.string(),
  wallet_provider: z.string(),
  email: z.string().optional(),
  created_at: z.string(),
});

const BridgeReadinessResponseSchema = z.object({
  public_id: z.string(),
  ready: z.boolean(),
  status: z.string(),
});

const BridgeChallengeResponseSchema = z.object({
  public_id: z.string(),
  status: z.string(),
  actual_amount: z.number().optional(),
});

const PaginationQuerySchema = z.object({
  limit: z.number().int().min(1).max(100).optional(),
  cursor: z.string().optional(),
  status: z.string().optional(),
});

const PublicIdParamSchema = z.object({
  publicId: z.string(),
});

const ClientIdParamSchema = z.object({
  clientId: z.string(),
});

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
});

function jsonContent(schema: z.ZodTypeAny) {
  return { 'application/json': { schema } };
}

function jsonRequest(schema: z.ZodTypeAny) {
  return { content: jsonContent(schema) };
}

function jsonResponse(schema: z.ZodTypeAny, description: string) {
  return { description, content: jsonContent(schema) };
}

function noContentResponse(description: string) {
  return { description };
}

function errorResponse(description: string) {
  return { description, content: jsonContent(ErrorResponseSchema) };
}

const bearerAuth = [{ bearerAuth: [] }];

const document = createDocument({
  openapi: '3.1.0',
  info: {
    title: 'ReineiraOS Modules API',
    version: '0.1.0',
    description: 'Backend API for ReineiraOS venture applications',
  },
  servers: [{ url: '/api/v1', description: 'API v1' }],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/auth/wallet/nonce': {
      post: {
        operationId: 'requestNonce',
        tags: ['Auth'],
        summary: 'Request authentication nonce',
        security: [],
        requestBody: jsonRequest(RequestNonceDtoSchema),
        responses: {
          '200': jsonResponse(RequestNonceResponseSchema, 'Nonce generated'),
          '400': errorResponse('Invalid request'),
        },
      },
    },
    '/auth/wallet/verify': {
      post: {
        operationId: 'verifyWallet',
        tags: ['Auth'],
        summary: 'Verify wallet signature',
        security: [],
        requestBody: jsonRequest(VerifyWalletDtoSchema),
        responses: {
          '200': jsonResponse(TokenResponseSchema, 'Wallet verified, tokens issued'),
          '400': errorResponse('Invalid request'),
          '401': errorResponse('Invalid signature'),
        },
      },
    },
    '/auth/tokens/refresh': {
      post: {
        operationId: 'refreshToken',
        tags: ['Auth'],
        summary: 'Refresh access token',
        security: [],
        requestBody: jsonRequest(RefreshTokenDtoSchema),
        responses: {
          '200': jsonResponse(TokenResponseSchema, 'Tokens refreshed'),
          '401': errorResponse('Invalid refresh token'),
        },
      },
    },
    '/auth/tokens': {
      post: {
        operationId: 'logout',
        tags: ['Auth'],
        summary: 'Revoke tokens (logout)',
        security: bearerAuth,
        responses: {
          '204': noContentResponse('Tokens revoked'),
          '401': errorResponse('Unauthorized'),
        },
      },
    },

    '/escrows': {
      post: {
        operationId: 'createEscrow',
        tags: ['Escrow'],
        summary: 'Create a new escrow',
        security: bearerAuth,
        requestBody: jsonRequest(CreateEscrowDtoSchema),
        responses: {
          '201': jsonResponse(CreateEscrowResponseSchema, 'Escrow created'),
          '400': errorResponse('Invalid request'),
          '401': errorResponse('Unauthorized'),
        },
      },
      get: {
        operationId: 'listEscrows',
        tags: ['Escrow'],
        summary: 'List escrows for current user',
        security: bearerAuth,
        requestParams: {
          query: PaginationQuerySchema,
        },
        responses: {
          '200': jsonResponse(PaginatedEscrowsResponseSchema, 'Paginated escrow list'),
          '401': errorResponse('Unauthorized'),
        },
      },
    },
    '/escrows/{publicId}': {
      get: {
        operationId: 'getEscrow',
        tags: ['Escrow'],
        summary: 'Get escrow by public ID',
        security: bearerAuth,
        requestParams: {
          path: PublicIdParamSchema,
        },
        responses: {
          '200': jsonResponse(EscrowResponseSchema, 'Escrow details'),
          '401': errorResponse('Unauthorized'),
          '404': errorResponse('Escrow not found'),
        },
      },
    },
    '/public/escrows/{publicId}': {
      get: {
        operationId: 'getPublicEscrow',
        tags: ['Escrow'],
        summary: 'Get public escrow details (no auth required)',
        security: [],
        requestParams: {
          path: PublicIdParamSchema,
        },
        responses: {
          '200': jsonResponse(PublicEscrowResponseSchema, 'Public escrow details'),
          '404': errorResponse('Escrow not found'),
        },
      },
    },

    '/withdrawals': {
      post: {
        operationId: 'createWithdrawal',
        tags: ['Withdrawal'],
        summary: 'Create a new withdrawal',
        security: bearerAuth,
        requestBody: jsonRequest(CreateWithdrawalDtoSchema),
        responses: {
          '201': jsonResponse(CreateWithdrawalResponseSchema, 'Withdrawal created'),
          '400': errorResponse('Invalid request'),
          '401': errorResponse('Unauthorized'),
        },
      },
      get: {
        operationId: 'listWithdrawals',
        tags: ['Withdrawal'],
        summary: 'List withdrawals for current user',
        security: bearerAuth,
        requestParams: {
          query: PaginationQuerySchema,
        },
        responses: {
          '200': jsonResponse(PaginatedWithdrawalsResponseSchema, 'Paginated withdrawal list'),
          '401': errorResponse('Unauthorized'),
        },
      },
    },
    '/withdrawals/{publicId}': {
      get: {
        operationId: 'getWithdrawal',
        tags: ['Withdrawal'],
        summary: 'Get withdrawal by public ID',
        security: bearerAuth,
        requestParams: {
          path: PublicIdParamSchema,
        },
        responses: {
          '200': jsonResponse(WithdrawalResponseSchema, 'Withdrawal details'),
          '401': errorResponse('Unauthorized'),
          '404': errorResponse('Withdrawal not found'),
        },
      },
    },
    '/withdrawals/{publicId}/bridge-readiness': {
      get: {
        operationId: 'checkBridgeReadiness',
        tags: ['Withdrawal'],
        summary: 'Check if withdrawal is ready for bridging',
        security: bearerAuth,
        requestParams: {
          path: PublicIdParamSchema,
        },
        responses: {
          '200': jsonResponse(BridgeReadinessResponseSchema, 'Bridge readiness status'),
          '401': errorResponse('Unauthorized'),
          '404': errorResponse('Withdrawal not found'),
        },
      },
    },
    '/withdrawals/{publicId}/bridge-challenge': {
      post: {
        operationId: 'createBridgeChallenge',
        tags: ['Withdrawal'],
        summary: 'Initiate bridge challenge for withdrawal',
        security: bearerAuth,
        requestParams: {
          path: PublicIdParamSchema,
        },
        responses: {
          '200': jsonResponse(BridgeChallengeResponseSchema, 'Bridge challenge initiated'),
          '400': errorResponse('Invalid state for bridge challenge'),
          '401': errorResponse('Unauthorized'),
          '404': errorResponse('Withdrawal not found'),
        },
      },
    },

    '/users/me': {
      get: {
        operationId: 'getCurrentUser',
        tags: ['User'],
        summary: 'Get current authenticated user',
        security: bearerAuth,
        responses: {
          '200': jsonResponse(UserResponseSchema, 'Current user details'),
          '401': errorResponse('Unauthorized'),
        },
      },
    },

    '/balance': {
      get: {
        operationId: 'getBalance',
        tags: ['Balance'],
        summary: 'Get wallet balance',
        security: bearerAuth,
        responses: {
          '200': jsonResponse(BalanceResponseSchema, 'Wallet balance'),
          '401': errorResponse('Unauthorized'),
        },
      },
    },

    '/business-profiles': {
      post: {
        operationId: 'createBusinessProfile',
        tags: ['Business Profile'],
        summary: 'Create a business profile',
        security: bearerAuth,
        requestBody: jsonRequest(CreateBusinessProfileDtoSchema),
        responses: {
          '201': jsonResponse(BusinessProfileResponseSchema, 'Business profile created'),
          '400': errorResponse('Invalid request'),
          '401': errorResponse('Unauthorized'),
        },
      },
    },

    '/api-credentials': {
      post: {
        operationId: 'generateCredentials',
        tags: ['Credentials'],
        summary: 'Generate new API credentials',
        security: bearerAuth,
        responses: {
          '201': jsonResponse(GenerateCredentialsResponseSchema, 'Credentials generated'),
          '401': errorResponse('Unauthorized'),
        },
      },
      get: {
        operationId: 'listCredentials',
        tags: ['Credentials'],
        summary: 'List API credentials',
        security: bearerAuth,
        responses: {
          '200': jsonResponse(GetCredentialsResponseSchema, 'Credentials list'),
          '401': errorResponse('Unauthorized'),
        },
      },
    },
    '/api-credentials/{clientId}': {
      delete: {
        operationId: 'revokeCredentials',
        tags: ['Credentials'],
        summary: 'Revoke API credentials',
        security: bearerAuth,
        requestParams: {
          path: ClientIdParamSchema,
        },
        responses: {
          '204': noContentResponse('Credentials revoked'),
          '401': errorResponse('Unauthorized'),
          '404': errorResponse('Credentials not found'),
        },
      },
    },
    '/api-credentials/oauth/token': {
      post: {
        operationId: 'oauthTokenExchange',
        tags: ['Credentials'],
        summary: 'Exchange client credentials for access token',
        security: [],
        requestBody: jsonRequest(OAuthTokenRequestSchema),
        responses: {
          '200': jsonResponse(OAuthTokenResponseSchema, 'Access token issued'),
          '400': errorResponse('Invalid request'),
          '401': errorResponse('Invalid credentials'),
        },
      },
    },

    '/transactions/escrows/report': {
      post: {
        operationId: 'reportEscrowTransaction',
        tags: ['Transactions'],
        summary: 'Report an escrow transaction hash',
        security: bearerAuth,
        requestBody: jsonRequest(ReportEscrowTransactionDtoSchema),
        responses: {
          '200': jsonResponse(ReportTransactionResponseSchema, 'Transaction reported'),
          '400': errorResponse('Invalid request'),
          '401': errorResponse('Unauthorized'),
        },
      },
    },
    '/transactions/withdrawals/report': {
      post: {
        operationId: 'reportWithdrawalTransaction',
        tags: ['Transactions'],
        summary: 'Report a withdrawal transaction hash',
        security: bearerAuth,
        requestBody: jsonRequest(ReportWithdrawalTransactionDtoSchema),
        responses: {
          '200': jsonResponse(ReportTransactionResponseSchema, 'Transaction reported'),
          '400': errorResponse('Invalid request'),
          '401': errorResponse('Unauthorized'),
        },
      },
    },

    '/webhooks/quicknode': {
      post: {
        operationId: 'quicknodeWebhook',
        tags: ['Webhooks'],
        summary: 'QuickNode event webhook receiver',
        security: [],
        responses: {
          '200': noContentResponse('Webhook processed'),
        },
      },
    },
    '/webhooks/relay-callback': {
      post: {
        operationId: 'relayCallbackWebhook',
        tags: ['Webhooks'],
        summary: 'Relay operator callback webhook',
        security: [],
        responses: {
          '200': noContentResponse('Callback processed'),
        },
      },
    },
  },
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, '..', 'openapi.json');

writeFileSync(outputPath, JSON.stringify(document, null, 2) + '\n');

console.log(`OpenAPI spec written to ${outputPath}`);
