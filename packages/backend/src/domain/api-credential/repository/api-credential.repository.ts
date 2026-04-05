import type { ApiCredential } from '../model/api-credential.js';

export interface IApiCredentialRepository {
  findByClientId(clientId: string): Promise<ApiCredential | null>;
  findByUserId(userId: string): Promise<ApiCredential[]>;
  save(credential: ApiCredential): Promise<void>;
  update(credential: ApiCredential): Promise<void>;
}
