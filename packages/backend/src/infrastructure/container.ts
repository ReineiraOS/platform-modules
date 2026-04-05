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
import { JwtService } from './auth/jwt.service.js';
import { NonceService } from './auth/nonce.service.js';
import { SiweVerifier } from './auth/siwe-verifier.js';
import { FheService } from './fhe/fhe.service.js';
import { QuickNodeVerifier } from './webhook/quicknode-verifier.js';
import { getEnv } from '../core/config.js';

const nonceRepo = new MemoryNonceRepository();
const userRepo = new MemoryUserRepository();
const sessionRepo = new MemorySessionRepository();
const escrowRepo = new MemoryEscrowRepository();
const withdrawalRepo = new MemoryWithdrawalRepository();
const businessProfileRepo = new MemoryBusinessProfileRepository();
const apiCredentialRepo = new MemoryApiCredentialRepository();
const escrowEventRepo = new MemoryEscrowEventRepository();

const jwtService = new JwtService();
const nonceService = new NonceService(nonceRepo);
const siweVerifier = new SiweVerifier();
const fheService = new FheService();

function getQuickNodeVerifier(): QuickNodeVerifier | null {
  const secret = getEnv().QUICKNODE_WEBHOOK_SECRET;
  return secret ? new QuickNodeVerifier(secret) : null;
}

export const container = {
  nonceRepo,
  userRepo,
  sessionRepo,
  escrowRepo,
  withdrawalRepo,
  businessProfileRepo,
  apiCredentialRepo,
  escrowEventRepo,
  jwtService,
  nonceService,
  siweVerifier,
  fheService,
  getQuickNodeVerifier,
};
