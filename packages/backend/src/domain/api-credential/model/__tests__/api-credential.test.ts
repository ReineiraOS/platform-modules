import { describe, it, expect } from 'vitest';
import { ApiCredential, ApiCredentialParams } from '../api-credential.js';

function makeApiCredentialParams(overrides?: Partial<ApiCredentialParams>): ApiCredentialParams {
  return {
    id: 'cred-1',
    clientId: 'client-abc',
    userId: 'user-1',
    hashedSecret: 'hashed-secret-value',
    salt: 'random-salt',
    status: 'active',
    createdAt: new Date('2025-01-01'),
    ...overrides,
  };
}

describe('ApiCredential', () => {
  describe('constructor', () => {
    it('assigns all required fields', () => {
      const params = makeApiCredentialParams();
      const cred = new ApiCredential(params);
      expect(cred.id).toBe(params.id);
      expect(cred.clientId).toBe(params.clientId);
      expect(cred.userId).toBe(params.userId);
      expect(cred.hashedSecret).toBe(params.hashedSecret);
      expect(cred.salt).toBe(params.salt);
      expect(cred.status).toBe(params.status);
      expect(cred.createdAt).toBe(params.createdAt);
    });

    it('assigns optional lastUsedAt when provided', () => {
      const lastUsedAt = new Date('2025-06-01');
      const cred = new ApiCredential(makeApiCredentialParams({ lastUsedAt }));
      expect(cred.lastUsedAt).toBe(lastUsedAt);
    });

    it('leaves lastUsedAt undefined when not provided', () => {
      const cred = new ApiCredential(makeApiCredentialParams());
      expect(cred.lastUsedAt).toBeUndefined();
    });
  });

  describe('revoke', () => {
    it('changes status to revoked', () => {
      const cred = new ApiCredential(makeApiCredentialParams({ status: 'active' }));
      cred.revoke();
      expect(cred.status).toBe('revoked');
    });

    it('returns this for chaining', () => {
      const cred = new ApiCredential(makeApiCredentialParams());
      expect(cred.revoke()).toBe(cred);
    });

    it('can be called on an already revoked credential', () => {
      const cred = new ApiCredential(makeApiCredentialParams({ status: 'revoked' }));
      cred.revoke();
      expect(cred.status).toBe('revoked');
    });
  });

  describe('touch', () => {
    it('sets lastUsedAt to a recent date', () => {
      const before = new Date();
      const cred = new ApiCredential(makeApiCredentialParams());
      cred.touch();
      const after = new Date();
      expect(cred.lastUsedAt).toBeInstanceOf(Date);
      expect(cred.lastUsedAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(cred.lastUsedAt!.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('overwrites an existing lastUsedAt', () => {
      const oldDate = new Date('2020-01-01');
      const cred = new ApiCredential(makeApiCredentialParams({ lastUsedAt: oldDate }));
      cred.touch();
      expect(cred.lastUsedAt).not.toBe(oldDate);
    });

    it('returns this for chaining', () => {
      const cred = new ApiCredential(makeApiCredentialParams());
      expect(cred.touch()).toBe(cred);
    });
  });

  describe('isActive', () => {
    it('returns true when status is active', () => {
      const cred = new ApiCredential(makeApiCredentialParams({ status: 'active' }));
      expect(cred.isActive()).toBe(true);
    });

    it('returns false when status is revoked', () => {
      const cred = new ApiCredential(makeApiCredentialParams({ status: 'revoked' }));
      expect(cred.isActive()).toBe(false);
    });

    it('returns false after calling revoke()', () => {
      const cred = new ApiCredential(makeApiCredentialParams({ status: 'active' }));
      cred.revoke();
      expect(cred.isActive()).toBe(false);
    });

    it('returns true on a freshly constructed active credential', () => {
      const cred = new ApiCredential(makeApiCredentialParams());
      expect(cred.isActive()).toBe(true);
    });
  });
});
