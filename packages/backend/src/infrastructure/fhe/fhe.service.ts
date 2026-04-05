import type { Logger } from 'pino';
import { EncryptedValue } from '../../domain/fhe/model/encrypted-value.js';
import { EncryptedEscrowData } from '../../domain/fhe/model/encrypted-escrow-data.js';
import { FheWorkerClient } from './fhe-worker.client.js';
import { getLogger } from '../../core/logger.js';

export interface IFheService {
  encryptEscrowData(amount: bigint, ownerAddress: string, userAddress: string): Promise<EncryptedEscrowData>;
}

export class FheService implements IFheService {
  private client: FheWorkerClient;
  private logger: Logger;
  private initialized = false;

  constructor() {
    this.client = new FheWorkerClient();
    this.logger = getLogger('FheService');
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    const healthy = await this.client.healthCheck();
    if (!healthy) {
      this.logger.warn('FHE worker not available, encryption may fail');
    }
    this.initialized = true;
  }

  async encryptEscrowData(amount: bigint, ownerAddress: string, userAddress: string): Promise<EncryptedEscrowData> {
    await this.ensureInitialized();

    const response = await this.client.encryptBatch(userAddress, [
      { type: 'euint64', value: amount.toString() },
      { type: 'eaddress', value: ownerAddress },
    ]);

    const [amountResult, ownerResult] = response.results;

    const encryptedAmount = new EncryptedValue({
      type: 'euint64',
      data: amountResult.data,
      securityZone: amountResult.securityZone,
      utype: amountResult.utype,
      inputProof: amountResult.inputProof,
      userAddress,
    });

    const encryptedOwner = new EncryptedValue({
      type: 'eaddress',
      data: ownerResult.data,
      securityZone: ownerResult.securityZone,
      utype: ownerResult.utype,
      inputProof: ownerResult.inputProof,
      userAddress,
    });

    return new EncryptedEscrowData({
      encryptedAmount,
      encryptedOwner,
      userAddress,
      plaintextAmount: amount,
      plaintextOwner: ownerAddress,
    });
  }
}
