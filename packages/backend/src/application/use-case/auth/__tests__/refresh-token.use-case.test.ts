import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';
import { RefreshTokenUseCase } from '../refresh-token.use-case.js';
import { JwtService } from '../../../../infrastructure/auth/jwt.service.js';
import { MemorySessionRepository } from '../../../../infrastructure/repository/memory/memory-session.repository.js';
import { MemoryUserRepository } from '../../../../infrastructure/repository/memory/memory-user.repository.js';
import { User } from '../../../../domain/auth/model/user.js';
import { Session } from '../../../../domain/auth/model/session.js';
import { ApplicationHttpError } from '../../../../core/errors.js';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let jwtService: JwtService;
  let sessionRepo: MemorySessionRepository;
  let userRepo: MemoryUserRepository;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-chars-long';
    process.env.JWT_ISSUER = 'test-issuer';

    jwtService = new JwtService();
    sessionRepo = new MemorySessionRepository();
    userRepo = new MemoryUserRepository();
    useCase = new RefreshTokenUseCase(jwtService, sessionRepo, userRepo);
  });

  async function seedUserAndSession(): Promise<{ user: User; refreshToken: string }> {
    const user = new User({
      id: randomUUID(),
      walletAddress: '0xuser',
      walletProvider: 'walletconnect',
      createdAt: new Date(),
    });
    await userRepo.save(user);

    const tokenPair = await jwtService.generateTokenPair({
      sub: user.id,
      walletAddress: user.walletAddress,
      walletProvider: user.walletProvider,
    });

    const session = new Session({
      id: randomUUID(),
      userId: user.id,
      refreshToken: tokenPair.refreshToken,
      expiresAt: new Date(Date.now() + 3600000),
      createdAt: new Date(),
    });
    await sessionRepo.save(session);

    return { user, refreshToken: tokenPair.refreshToken };
  }

  it('returns new token pair for a valid refresh token', async () => {
    const { refreshToken } = await seedUserAndSession();
    const result = await useCase.execute({ refresh_token: refreshToken });

    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('refresh_token');
    expect(result.token_type).toBe('Bearer');
  });

  it('rotates the session — deletes old session and creates a new one', async () => {
    const { refreshToken } = await seedUserAndSession();
    const sessionsBeforeRefresh = await sessionRepo.findByUserId((await userRepo.findByWalletAddress('0xuser'))!.id);
    const oldSessionId = sessionsBeforeRefresh[0]!.id;

    const firstResult = await useCase.execute({ refresh_token: refreshToken });

    const oldSessionGone = await sessionRepo.findById(oldSessionId);
    expect(oldSessionGone).toBeNull();

    const newSession = await sessionRepo.findByRefreshToken(firstResult.refresh_token);
    expect(newSession).not.toBeNull();
    expect(newSession!.id).not.toBe(oldSessionId);
  });

  it('new session is stored with new refresh token', async () => {
    const { refreshToken } = await seedUserAndSession();
    const result = await useCase.execute({ refresh_token: refreshToken });

    const newSession = await sessionRepo.findByRefreshToken(result.refresh_token);
    expect(newSession).not.toBeNull();
  });

  it('throws unauthorized for a completely invalid token', async () => {
    await expect(useCase.execute({ refresh_token: 'not-a-jwt' })).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('throws unauthorized when session is expired', async () => {
    const user = new User({
      id: randomUUID(),
      walletAddress: '0xexpired',
      walletProvider: 'walletconnect',
      createdAt: new Date(),
    });
    await userRepo.save(user);

    const tokenPair = await jwtService.generateTokenPair({
      sub: user.id,
      walletAddress: user.walletAddress,
      walletProvider: user.walletProvider,
    });

    const expiredSession = new Session({
      id: randomUUID(),
      userId: user.id,
      refreshToken: tokenPair.refreshToken,
      expiresAt: new Date(Date.now() - 1000),
      createdAt: new Date(),
    });
    await sessionRepo.save(expiredSession);

    await expect(useCase.execute({ refresh_token: tokenPair.refreshToken })).rejects.toMatchObject({
      statusCode: 401,
    });
  });
});
