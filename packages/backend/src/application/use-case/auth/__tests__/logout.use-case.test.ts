import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';
import { LogoutUseCase } from '../logout.use-case.js';
import { MemorySessionRepository } from '../../../../infrastructure/repository/memory/memory-session.repository.js';
import { Session } from '../../../../domain/auth/model/session.js';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let sessionRepo: MemorySessionRepository;

  beforeEach(() => {
    sessionRepo = new MemorySessionRepository();
    useCase = new LogoutUseCase(sessionRepo);
  });

  it('deletes all sessions for the given user', async () => {
    const userId = randomUUID();

    const s1 = new Session({
      id: randomUUID(),
      userId,
      refreshToken: 'token-1',
      expiresAt: new Date(Date.now() + 60000),
      createdAt: new Date(),
    });
    const s2 = new Session({
      id: randomUUID(),
      userId,
      refreshToken: 'token-2',
      expiresAt: new Date(Date.now() + 60000),
      createdAt: new Date(),
    });
    await sessionRepo.save(s1);
    await sessionRepo.save(s2);

    await useCase.execute(userId);

    const remaining = await sessionRepo.findByUserId(userId);
    expect(remaining).toHaveLength(0);
  });

  it('does not affect sessions of other users', async () => {
    const userId = randomUUID();
    const otherUserId = randomUUID();

    await sessionRepo.save(
      new Session({
        id: randomUUID(),
        userId,
        refreshToken: 'mine',
        expiresAt: new Date(Date.now() + 60000),
        createdAt: new Date(),
      }),
    );
    await sessionRepo.save(
      new Session({
        id: randomUUID(),
        userId: otherUserId,
        refreshToken: 'theirs',
        expiresAt: new Date(Date.now() + 60000),
        createdAt: new Date(),
      }),
    );

    await useCase.execute(userId);

    const others = await sessionRepo.findByUserId(otherUserId);
    expect(others).toHaveLength(1);
  });

  it('resolves without error when user has no sessions', async () => {
    await expect(useCase.execute(randomUUID())).resolves.toBeUndefined();
  });
});
