import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VerifyWalletUseCase } from '../verify-wallet.use-case.js';
import { NonceService } from '../../../../infrastructure/auth/nonce.service.js';
import { JwtService } from '../../../../infrastructure/auth/jwt.service.js';
import { MemoryNonceRepository } from '../../../../infrastructure/repository/memory/memory-nonce.repository.js';
import { MemoryUserRepository } from '../../../../infrastructure/repository/memory/memory-user.repository.js';
import { MemorySessionRepository } from '../../../../infrastructure/repository/memory/memory-session.repository.js';
import { ApplicationHttpError } from '../../../../core/errors.js';
import type { SiweVerifier } from '../../../../infrastructure/auth/siwe-verifier.js';

const WALLET = '0xabCDEF1234567890ABcDEF1234567890aBCDeF12';
const NONCE = 'validnonce123';

function buildSiweMessage(nonce: string): string {
  return [
    `example.com wants you to sign in with your Ethereum account:`,
    WALLET,
    ``,
    `Sign in to example.com`,
    ``,
    `URI: https://example.com`,
    `Version: 1`,
    `Chain ID: 1`,
    `Nonce: ${nonce}`,
    `Issued At: 2024-01-01T00:00:00.000Z`,
  ].join('\n');
}

describe('VerifyWalletUseCase', () => {
  let useCase: VerifyWalletUseCase;
  let nonceRepo: MemoryNonceRepository;
  let userRepo: MemoryUserRepository;
  let sessionRepo: MemorySessionRepository;
  let siweVerifier: SiweVerifier;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-chars-long';
    process.env.JWT_ISSUER = 'test-issuer';

    nonceRepo = new MemoryNonceRepository();
    userRepo = new MemoryUserRepository();
    sessionRepo = new MemorySessionRepository();
    const nonceService = new NonceService(nonceRepo);
    const jwtService = new JwtService();

    siweVerifier = {
      verify: vi.fn().mockResolvedValue({ address: WALLET, valid: true }),
    } as unknown as SiweVerifier;

    useCase = new VerifyWalletUseCase(siweVerifier, nonceService, userRepo, sessionRepo, jwtService);
  });

  async function seedNonce(): Promise<void> {
    await nonceRepo.save(WALLET, NONCE, 300);
  }

  it('creates a new user and returns token pair when wallet is not registered', async () => {
    await seedNonce();
    const message = buildSiweMessage(NONCE);

    const result = await useCase.execute({
      wallet_address: WALLET,
      message,
      signature: '0xsig',
    });

    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('refresh_token');
    expect(result.token_type).toBe('Bearer');
    expect(result.expires_in).toBeGreaterThan(0);

    const user = await userRepo.findByWalletAddress(WALLET);
    expect(user).not.toBeNull();
  });

  it('finds existing user instead of creating a new one', async () => {
    await seedNonce();
    const message = buildSiweMessage(NONCE);

    await useCase.execute({ wallet_address: WALLET, message, signature: '0xsig' });

    await nonceRepo.save(WALLET, NONCE, 300);
    await useCase.execute({ wallet_address: WALLET, message, signature: '0xsig' });

    const users = await userRepo.findByWalletAddress(WALLET);
    expect(users).not.toBeNull();
    const sessions = await sessionRepo.findByUserId(users!.id);
    expect(sessions.length).toBeGreaterThanOrEqual(1);
  });

  it('creates a session and stores the refresh token', async () => {
    await seedNonce();
    const message = buildSiweMessage(NONCE);

    const result = await useCase.execute({ wallet_address: WALLET, message, signature: '0xsig' });
    const session = await sessionRepo.findByRefreshToken(result.refresh_token);
    expect(session).not.toBeNull();
  });

  it('throws unauthorized when SIWE signature is invalid', async () => {
    vi.mocked(siweVerifier.verify).mockResolvedValue({ address: '', valid: false });

    await expect(useCase.execute({ wallet_address: WALLET, message: 'msg', signature: '0xbad' })).rejects.toThrow(
      ApplicationHttpError,
    );
  });

  it('throws unauthorized when nonce is invalid', async () => {
    const message = buildSiweMessage('wrongnonce');

    await expect(useCase.execute({ wallet_address: WALLET, message, signature: '0xsig' })).rejects.toMatchObject({
      statusCode: 401,
    });
  });
});
