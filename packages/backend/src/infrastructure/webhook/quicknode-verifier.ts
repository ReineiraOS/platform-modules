import { createHmac } from 'crypto';

export class QuickNodeVerifier {
  constructor(private readonly secret: string) {}

  verify(payload: string, signature: string, nonce: string, timestamp: string): boolean {
    const hmac = createHmac('sha256', this.secret);
    hmac.update(nonce + timestamp + payload);
    const digest = hmac.digest('hex');

    return digest === signature;
  }
}
