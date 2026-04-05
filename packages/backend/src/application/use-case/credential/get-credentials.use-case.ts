import type { IApiCredentialRepository } from '../../../domain/api-credential/repository/api-credential.repository.js';
import type { GetCredentialsResponse } from '../../dto/credential/credential.dto.js';

export class GetCredentialsUseCase {
  constructor(private readonly credentialRepository: IApiCredentialRepository) {}

  async execute(userId: string): Promise<GetCredentialsResponse> {
    const credentials = await this.credentialRepository.findByUserId(userId);

    return {
      credentials: credentials.map((c) => ({
        client_id: c.clientId,
        status: c.status,
        created_at: c.createdAt.toISOString(),
        last_used_at: c.lastUsedAt?.toISOString(),
      })),
    };
  }
}
