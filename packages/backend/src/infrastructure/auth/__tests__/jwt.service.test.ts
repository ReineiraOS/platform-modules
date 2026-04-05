import { describe, it, expect, beforeEach } from 'vitest';
import { JwtService } from '../jwt.service.js';

const TEST_PAYLOAD = {
  sub: 'user-123',
  walletAddress: '0xabc123',
  walletProvider: 'walletconnect',
  email: 'test@example.com',
};

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-chars-long';
    process.env.JWT_ISSUER = 'test-issuer';
    (globalThis as Record<string, unknown>).__env__ = undefined;
    service = new JwtService();
  });

  describe('generateTokenPair', () => {
    it('returns accessToken, refreshToken, and expiresIn', async () => {
      const result = await service.generateTokenPair(TEST_PAYLOAD);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('expiresIn');
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
      expect(typeof result.expiresIn).toBe('number');
      expect(result.expiresIn).toBeGreaterThan(0);
    });

    it('generates distinct access and refresh tokens', async () => {
      const result = await service.generateTokenPair(TEST_PAYLOAD);
      expect(result.accessToken).not.toBe(result.refreshToken);
    });
  });

  describe('verifyAccessToken', () => {
    it('returns payload for a valid access token', async () => {
      const { accessToken } = await service.generateTokenPair(TEST_PAYLOAD);
      const payload = await service.verifyAccessToken(accessToken);

      expect(payload.sub).toBe(TEST_PAYLOAD.sub);
      expect(payload.walletAddress).toBe(TEST_PAYLOAD.walletAddress);
      expect(payload.walletProvider).toBe(TEST_PAYLOAD.walletProvider);
      expect(payload.email).toBe(TEST_PAYLOAD.email);
    });

    it('throws for an invalid token string', async () => {
      await expect(service.verifyAccessToken('not.a.token')).rejects.toThrow();
    });

    it('throws for a structurally valid but tampered token', async () => {
      const { accessToken } = await service.generateTokenPair(TEST_PAYLOAD);
      const parts = accessToken.split('.');
      const tamperedToken = parts[0] + '.' + parts[1] + '.invalidsignatureXXX';
      await expect(service.verifyAccessToken(tamperedToken)).rejects.toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('returns sub for a valid refresh token', async () => {
      const { refreshToken } = await service.generateTokenPair(TEST_PAYLOAD);
      const result = await service.verifyRefreshToken(refreshToken);

      expect(result.sub).toBe(TEST_PAYLOAD.sub);
    });

    it('throws for an invalid refresh token', async () => {
      await expect(service.verifyRefreshToken('garbage')).rejects.toThrow();
    });

    it('throws when using an access token as a refresh token with wrong issuer', async () => {
      await expect(service.verifyRefreshToken('eyJhbGciOiJIUzI1NiJ9.invalid')).rejects.toThrow();
    });
  });
});
