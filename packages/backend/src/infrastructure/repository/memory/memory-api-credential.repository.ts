import type { IApiCredentialRepository } from '../../../domain/api-credential/repository/api-credential.repository.js';
import type { ApiCredential } from '../../../domain/api-credential/model/api-credential.js';

export class MemoryApiCredentialRepository implements IApiCredentialRepository {
  private readonly store = new Map<string, ApiCredential>();

  async findByClientId(clientId: string): Promise<ApiCredential | null> {
    for (const credential of this.store.values()) {
      if (credential.clientId === clientId) return credential;
    }
    return null;
  }

  async findByUserId(userId: string): Promise<ApiCredential[]> {
    return [...this.store.values()].filter((c) => c.userId === userId);
  }

  async save(credential: ApiCredential): Promise<void> {
    this.store.set(credential.id, credential);
  }

  async update(credential: ApiCredential): Promise<void> {
    this.store.set(credential.id, credential);
  }
}
