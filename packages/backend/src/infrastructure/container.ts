import {
  MemoryNonceRepository,
  MemoryUserRepository,
  MemorySessionRepository,
  MemoryEscrowRepository,
  MemoryWithdrawalRepository,
  MemoryBusinessProfileRepository,
  MemoryApiCredentialRepository,
  MemoryEscrowEventRepository,
} from './repository/memory/index.js';
import {
  PgNonceRepository,
  PgUserRepository,
  PgSessionRepository,
  PgEscrowRepository,
  PgWithdrawalRepository,
  PgBusinessProfileRepository,
  PgApiCredentialRepository,
  PgEscrowEventRepository,
} from './repository/postgres/index.js';
import { getDb } from './repository/postgres/db.js';
import { JwtService } from './auth/jwt.service.js';
import { NonceService } from './auth/nonce.service.js';
import { SiweVerifier } from './auth/siwe-verifier.js';
import { FheService } from './fhe/fhe.service.js';
import { QuickNodeVerifier } from './webhook/quicknode-verifier.js';
import { getEnv } from '../core/config.js';
import type { INonceRepository } from '../domain/nonce/repository/nonce.repository.js';
import type { IUserRepository } from '../domain/auth/repository/user.repository.js';
import type { ISessionRepository } from '../domain/auth/repository/session.repository.js';
import type { IEscrowRepository } from '../domain/escrow/repository/escrow.repository.js';
import type { IWithdrawalRepository } from '../domain/withdrawal/repository/withdrawal.repository.js';
import type { IBusinessProfileRepository } from '../domain/business-profile/repository/business-profile.repository.js';
import type { IApiCredentialRepository } from '../domain/api-credential/repository/api-credential.repository.js';
import type { IEscrowEventRepository } from '../domain/escrow/events/repository/escrow-event.repository.js';

interface Repositories {
  nonceRepo: INonceRepository;
  userRepo: IUserRepository;
  sessionRepo: ISessionRepository;
  escrowRepo: IEscrowRepository;
  withdrawalRepo: IWithdrawalRepository;
  businessProfileRepo: IBusinessProfileRepository;
  apiCredentialRepo: IApiCredentialRepository;
  escrowEventRepo: IEscrowEventRepository;
}

function createMemoryRepos(): Repositories {
  return {
    nonceRepo: new MemoryNonceRepository(),
    userRepo: new MemoryUserRepository(),
    sessionRepo: new MemorySessionRepository(),
    escrowRepo: new MemoryEscrowRepository(),
    withdrawalRepo: new MemoryWithdrawalRepository(),
    businessProfileRepo: new MemoryBusinessProfileRepository(),
    apiCredentialRepo: new MemoryApiCredentialRepository(),
    escrowEventRepo: new MemoryEscrowEventRepository(),
  };
}

function createPostgresRepos(): Repositories {
  const db = getDb();
  return {
    nonceRepo: new PgNonceRepository(db),
    userRepo: new PgUserRepository(db),
    sessionRepo: new PgSessionRepository(db),
    escrowRepo: new PgEscrowRepository(db),
    withdrawalRepo: new PgWithdrawalRepository(db),
    businessProfileRepo: new PgBusinessProfileRepository(db),
    apiCredentialRepo: new PgApiCredentialRepository(db),
    escrowEventRepo: new PgEscrowEventRepository(db),
  };
}

let _repos: Repositories | null = null;

function getRepos(): Repositories {
  if (!_repos) {
    const provider = getEnv().DB_PROVIDER;
    _repos = provider === 'postgres' ? createPostgresRepos() : createMemoryRepos();
  }
  return _repos;
}

const jwtService = new JwtService();
const siweVerifier = new SiweVerifier();
const fheService = new FheService();

function getQuickNodeVerifier(): QuickNodeVerifier | null {
  const secret = getEnv().QUICKNODE_WEBHOOK_SECRET;
  return secret ? new QuickNodeVerifier(secret) : null;
}

export const container = {
  get nonceRepo() {
    return getRepos().nonceRepo;
  },
  get userRepo() {
    return getRepos().userRepo;
  },
  get sessionRepo() {
    return getRepos().sessionRepo;
  },
  get escrowRepo() {
    return getRepos().escrowRepo;
  },
  get withdrawalRepo() {
    return getRepos().withdrawalRepo;
  },
  get businessProfileRepo() {
    return getRepos().businessProfileRepo;
  },
  get apiCredentialRepo() {
    return getRepos().apiCredentialRepo;
  },
  get escrowEventRepo() {
    return getRepos().escrowEventRepo;
  },
  get nonceService() {
    return new NonceService(getRepos().nonceRepo);
  },
  jwtService,
  siweVerifier,
  fheService,
  getQuickNodeVerifier,
};
