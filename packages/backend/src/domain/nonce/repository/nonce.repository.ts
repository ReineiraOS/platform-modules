export interface INonceRepository {
  save(walletAddress: string, nonce: string, ttlSeconds: number): Promise<void>;
  findAndDelete(walletAddress: string, nonce: string): Promise<boolean>;
}
