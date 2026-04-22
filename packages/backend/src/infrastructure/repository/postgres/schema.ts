import { pgTable, pgEnum, text, timestamp, integer, numeric, jsonb, index, primaryKey } from 'drizzle-orm/pg-core';

export const escrowStatusEnum = pgEnum('escrow_status', [
  'PENDING',
  'ON_CHAIN',
  'PROCESSING',
  'SETTLED',
  'REDEEMED',
  'EXPIRED',
  'CANCELED',
  'FAILED',
]);

export const withdrawalStatusEnum = pgEnum('withdrawal_status', [
  'PENDING_REDEEM',
  'PENDING_BRIDGE',
  'BRIDGING',
  'COMPLETED',
  'FAILED',
]);

export const businessTypeEnum = pgEnum('business_type', ['RETAIL', 'SERVICE']);

export const credentialStatusEnum = pgEnum('credential_status', ['active', 'revoked']);

export const escrowEventTypeEnum = pgEnum('escrow_event_type', ['EscrowCreated', 'EscrowSettled']);

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    walletAddress: text('wallet_address').unique().notNull(),
    walletProvider: text('wallet_provider').notNull(),
    email: text('email'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [index('users_wallet_address_idx').on(t.walletAddress)],
);

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .references(() => users.id)
      .notNull(),
    refreshToken: text('refresh_token').unique().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userAgent: text('user_agent'),
    ipAddress: text('ip_address'),
  },
  (t) => [index('sessions_refresh_token_idx').on(t.refreshToken), index('sessions_user_id_idx').on(t.userId)],
);

export const nonces = pgTable(
  'nonces',
  {
    walletAddress: text('wallet_address').notNull(),
    nonce: text('nonce').notNull(),
    expiresAt: integer('expires_at').notNull(),
  },
  (t) => [primaryKey({ columns: [t.walletAddress, t.nonce] })],
);

export const escrows = pgTable(
  'escrows',
  {
    id: text('id').primaryKey(),
    publicId: text('public_id').unique().notNull(),
    userId: text('user_id')
      .references(() => users.id)
      .notNull(),
    type: text('type').notNull(),
    counterparty: text('counterparty'),
    deadline: timestamp('deadline'),
    externalReference: text('external_reference'),
    amount: numeric('amount').notNull(),
    currencyType: text('currency_type').notNull(),
    currencyCode: text('currency_code').notNull(),
    status: escrowStatusEnum('status').notNull().default('PENDING'),
    walletId: text('wallet_id').notNull(),
    metadata: jsonb('metadata'),
    onChainEscrowId: text('on_chain_escrow_id'),
    txHash: text('tx_hash'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('escrows_public_id_idx').on(t.publicId),
    index('escrows_user_id_status_idx').on(t.userId, t.status),
    index('escrows_tx_hash_idx').on(t.txHash),
    index('escrows_on_chain_escrow_id_idx').on(t.onChainEscrowId),
  ],
);

export const withdrawals = pgTable(
  'withdrawals',
  {
    id: text('id').primaryKey(),
    publicId: text('public_id').unique().notNull(),
    userId: text('user_id')
      .references(() => users.id)
      .notNull(),
    walletId: text('wallet_id').notNull(),
    escrowIds: jsonb('escrow_ids').notNull().$type<number[]>(),
    destinationChain: integer('destination_chain').notNull(),
    destinationDomain: integer('destination_domain').notNull(),
    recipientAddress: text('recipient_address').notNull(),
    status: withdrawalStatusEnum('status').notNull().default('PENDING_REDEEM'),
    estimatedAmount: numeric('estimated_amount').notNull(),
    walletProvider: text('wallet_provider').notNull(),
    actualAmount: numeric('actual_amount'),
    fee: numeric('fee'),
    redeemTxHash: text('redeem_tx_hash'),
    bridgeTxHash: text('bridge_tx_hash'),
    destinationTxHash: text('destination_tx_hash'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    completedAt: timestamp('completed_at'),
  },
  (t) => [
    index('withdrawals_public_id_idx').on(t.publicId),
    index('withdrawals_user_id_status_idx').on(t.userId, t.status),
  ],
);

export const businessProfiles = pgTable(
  'business_profiles',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .references(() => users.id)
      .unique()
      .notNull(),
    businessName: text('business_name').notNull(),
    businessType: businessTypeEnum('business_type').notNull(),
    businessAddress: text('business_address'),
    taxId: text('tax_id'),
  },
  (t) => [index('business_profiles_user_id_idx').on(t.userId)],
);

export const apiCredentials = pgTable(
  'api_credentials',
  {
    id: text('id').primaryKey(),
    clientId: text('client_id').unique().notNull(),
    userId: text('user_id')
      .references(() => users.id)
      .notNull(),
    hashedSecret: text('hashed_secret').notNull(),
    salt: text('salt').notNull(),
    status: credentialStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    lastUsedAt: timestamp('last_used_at'),
  },
  (t) => [index('api_credentials_client_id_idx').on(t.clientId), index('api_credentials_user_id_idx').on(t.userId)],
);

export const escrowEvents = pgTable(
  'escrow_events',
  {
    txHash: text('tx_hash').primaryKey(),
    escrowId: text('escrow_id').notNull(),
    eventType: escrowEventTypeEnum('event_type').notNull(),
    blockNumber: text('block_number').notNull(),
    createdAt: text('created_at').notNull(),
    ttl: integer('ttl').notNull(),
    messageHash: text('message_hash'),
    amount: text('amount'),
  },
  (t) => [index('escrow_events_escrow_id_idx').on(t.escrowId)],
);
