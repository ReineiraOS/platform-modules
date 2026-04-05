import { describe, it, expect } from 'vitest';
import { createHmac } from 'crypto';
import { QuickNodeVerifier } from '../quicknode-verifier.js';

const SECRET = 'webhook-secret-key';
const NONCE = 'abc123nonce';
const TIMESTAMP = '1700000000';
const PAYLOAD = JSON.stringify({ event: 'test', data: { id: 1 } });

function buildSignature(secret: string, nonce: string, timestamp: string, payload: string): string {
  const hmac = createHmac('sha256', secret);
  hmac.update(nonce + timestamp + payload);
  return hmac.digest('hex');
}

describe('QuickNodeVerifier', () => {
  describe('verify', () => {
    it('returns true when the HMAC signature matches', () => {
      const verifier = new QuickNodeVerifier(SECRET);
      const signature = buildSignature(SECRET, NONCE, TIMESTAMP, PAYLOAD);

      expect(verifier.verify(PAYLOAD, signature, NONCE, TIMESTAMP)).toBe(true);
    });

    it('returns false when the signature is wrong', () => {
      const verifier = new QuickNodeVerifier(SECRET);
      expect(verifier.verify(PAYLOAD, 'wrongsignature', NONCE, TIMESTAMP)).toBe(false);
    });

    it('returns false when the payload is tampered', () => {
      const verifier = new QuickNodeVerifier(SECRET);
      const signature = buildSignature(SECRET, NONCE, TIMESTAMP, PAYLOAD);
      const tamperedPayload = JSON.stringify({ event: 'test', data: { id: 2 } });

      expect(verifier.verify(tamperedPayload, signature, NONCE, TIMESTAMP)).toBe(false);
    });

    it('returns false when the nonce differs', () => {
      const verifier = new QuickNodeVerifier(SECRET);
      const signature = buildSignature(SECRET, NONCE, TIMESTAMP, PAYLOAD);

      expect(verifier.verify(PAYLOAD, signature, 'differentnonce', TIMESTAMP)).toBe(false);
    });

    it('returns false when the timestamp differs', () => {
      const verifier = new QuickNodeVerifier(SECRET);
      const signature = buildSignature(SECRET, NONCE, TIMESTAMP, PAYLOAD);

      expect(verifier.verify(PAYLOAD, signature, NONCE, '9999999999')).toBe(false);
    });

    it('returns false when the secret is wrong', () => {
      const verifier = new QuickNodeVerifier('wrong-secret');
      const signature = buildSignature(SECRET, NONCE, TIMESTAMP, PAYLOAD);

      expect(verifier.verify(PAYLOAD, signature, NONCE, TIMESTAMP)).toBe(false);
    });
  });
});
