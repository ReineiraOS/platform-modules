import { randomBytes } from 'crypto';
import type { INonceRepository } from '../../domain/nonce/repository/nonce.repository.js';

const NONCE_TTL_SECONDS = 300;

export class NonceService {
  constructor(private readonly nonceRepository: INonceRepository) {}

  async generateNonce(walletAddress: string): Promise<string> {
    const nonce = randomBytes(32).toString('hex');
    await this.nonceRepository.save(walletAddress, nonce, NONCE_TTL_SECONDS);
    return nonce;
  }

  async verifyNonce(walletAddress: string, nonce: string): Promise<boolean> {
    return this.nonceRepository.findAndDelete(walletAddress, nonce);
  }
}
