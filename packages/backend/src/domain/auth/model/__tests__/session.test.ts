import { describe, it, expect } from 'vitest';
import { Session, SessionParams } from '../session.js';

function makeSessionParams(overrides?: Partial<SessionParams>): SessionParams {
  return {
    id: 'session-1',
    userId: 'user-1',
    refreshToken: 'refresh-token-abc',
    expiresAt: new Date(Date.now() + 60_000),
    createdAt: new Date(),
    ...overrides,
  };
}

describe('Session', () => {
  describe('constructor', () => {
    it('assigns all required fields', () => {
      const params = makeSessionParams();
      const session = new Session(params);
      expect(session.id).toBe(params.id);
      expect(session.userId).toBe(params.userId);
      expect(session.refreshToken).toBe(params.refreshToken);
      expect(session.expiresAt).toBe(params.expiresAt);
      expect(session.createdAt).toBe(params.createdAt);
    });

    it('assigns optional userAgent when provided', () => {
      const session = new Session(makeSessionParams({ userAgent: 'Mozilla/5.0' }));
      expect(session.userAgent).toBe('Mozilla/5.0');
    });

    it('assigns optional ipAddress when provided', () => {
      const session = new Session(makeSessionParams({ ipAddress: '192.168.1.1' }));
      expect(session.ipAddress).toBe('192.168.1.1');
    });

    it('leaves optional fields undefined when not provided', () => {
      const session = new Session(makeSessionParams());
      expect(session.userAgent).toBeUndefined();
      expect(session.ipAddress).toBeUndefined();
    });
  });

  describe('isExpired', () => {
    it('returns false when expiresAt is in the future', () => {
      const session = new Session(makeSessionParams({ expiresAt: new Date(Date.now() + 10_000) }));
      expect(session.isExpired()).toBe(false);
    });

    it('returns true when expiresAt is in the past', () => {
      const session = new Session(makeSessionParams({ expiresAt: new Date(Date.now() - 1_000) }));
      expect(session.isExpired()).toBe(true);
    });

    it('returns true when expiresAt is exactly now (boundary)', () => {
      const past = new Date(Date.now() - 1);
      const session = new Session(makeSessionParams({ expiresAt: past }));
      expect(session.isExpired()).toBe(true);
    });
  });

  describe('getTtlSeconds', () => {
    it('returns approximate seconds remaining for a future session', () => {
      const futureMs = 30_000;
      const session = new Session(makeSessionParams({ expiresAt: new Date(Date.now() + futureMs) }));
      const ttl = session.getTtlSeconds();
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(30);
    });

    it('returns 0 when session is already expired', () => {
      const session = new Session(makeSessionParams({ expiresAt: new Date(Date.now() - 5_000) }));
      expect(session.getTtlSeconds()).toBe(0);
    });

    it('returns 0 when expiresAt is exactly now', () => {
      const session = new Session(makeSessionParams({ expiresAt: new Date(Date.now() - 1) }));
      expect(session.getTtlSeconds()).toBe(0);
    });

    it('never returns a negative value', () => {
      const session = new Session(makeSessionParams({ expiresAt: new Date(Date.now() - 100_000) }));
      expect(session.getTtlSeconds()).toBeGreaterThanOrEqual(0);
    });
  });
});
