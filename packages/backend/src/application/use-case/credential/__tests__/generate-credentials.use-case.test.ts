import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';
import { GenerateCredentialsUseCase } from '../generate-credentials.use-case.js';
import { MemoryApiCredentialRepository } from '../../../../infrastructure/repository/memory/memory-api-credential.repository.js';

describe('GenerateCredentialsUseCase', () => {
  let useCase: GenerateCredentialsUseCase;
  let repo: MemoryApiCredentialRepository;
  const USER_ID = randomUUID();

  beforeEach(() => {
    repo = new MemoryApiCredentialRepository();
    useCase = new GenerateCredentialsUseCase(repo);
  });

  it('returns client_id starting with rc_', async () => {
    const result = await useCase.execute(USER_ID);
    expect(result.client_id).toMatch(/^rc_/);
  });

  it('returns a client_secret as a hex string', async () => {
    const result = await useCase.execute(USER_ID);
    expect(result.client_secret).toMatch(/^[0-9a-f]+$/);
    expect(result.client_secret.length).toBeGreaterThan(0);
  });

  it('returns status active and a created_at timestamp', async () => {
    const result = await useCase.execute(USER_ID);
    expect(result.status).toBe('active');
    expect(typeof result.created_at).toBe('string');
    expect(() => new Date(result.created_at)).not.toThrow();
  });

  it('saves credential to repository with hashed secret (not plaintext)', async () => {
    const result = await useCase.execute(USER_ID);

    const saved = await repo.findByClientId(result.client_id);
    expect(saved).not.toBeNull();
    expect(saved!.hashedSecret).not.toBe(result.client_secret);
    expect(saved!.salt).toBeDefined();
  });

  it('generates unique client_id on each call', async () => {
    const r1 = await useCase.execute(USER_ID);
    const r2 = await useCase.execute(USER_ID);
    expect(r1.client_id).not.toBe(r2.client_id);
  });

  it('saved credential belongs to the given userId', async () => {
    const result = await useCase.execute(USER_ID);
    const saved = await repo.findByClientId(result.client_id);
    expect(saved!.userId).toBe(USER_ID);
  });
});
