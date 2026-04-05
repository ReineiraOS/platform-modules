import type { Logger } from 'pino';
import { getEnv } from '../../core/config.js';
import { getLogger } from '../../core/logger.js';
import { ApplicationHttpError } from '../../core/errors.js';

export interface FheEncryptionItem {
  type: 'euint64' | 'eaddress' | 'ebool';
  value: string | boolean;
}

export interface FheEncryptedResult {
  type: string;
  data: string;
  securityZone: number;
  utype: number;
  inputProof: string;
  encryptionTimeMs: number;
}

export interface FheBatchResponse {
  results: FheEncryptedResult[];
  totalEncryptionTimeMs: number;
}

export class FheWorkerClient {
  private baseUrl: string;
  private logger: Logger;

  constructor() {
    this.baseUrl = getEnv().FHE_WORKER_URL;
    this.logger = getLogger('FheWorkerClient');
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health/ready`, {
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async encryptBatch(userAddress: string, items: FheEncryptionItem[]): Promise<FheBatchResponse> {
    this.logger.info({ userAddress, itemCount: items.length }, 'Encrypting batch via FHE worker');

    const res = await fetch(`${this.baseUrl}/api/v1/encrypt/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAddress, items }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      this.logger.error({ status: res.status, error }, 'FHE worker encryption failed');

      if (res.status === 503) {
        throw ApplicationHttpError.internalError('FHE worker not ready');
      }
      throw ApplicationHttpError.internalError(
        `FHE encryption failed: ${(error as Record<string, string>).detail || res.statusText}`,
      );
    }

    const data = (await res.json()) as FheBatchResponse;
    this.logger.info({ totalTime: data.totalEncryptionTimeMs }, 'FHE batch encryption complete');
    return data;
  }
}
