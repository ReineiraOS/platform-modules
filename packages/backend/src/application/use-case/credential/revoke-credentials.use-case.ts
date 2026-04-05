import type { IApiCredentialRepository } from '../../../domain/api-credential/repository/api-credential.repository.js';
import { ApplicationHttpError } from '../../../core/errors.js';

export class RevokeCredentialsUseCase {
  constructor(private readonly credentialRepository: IApiCredentialRepository) {}

  async execute(clientId: string, userId: string): Promise<void> {
    const credential = await this.credentialRepository.findByClientId(clientId);
    if (!credential) {
      throw ApplicationHttpError.notFound('Credential not found');
    }
    if (credential.userId !== userId) {
      throw ApplicationHttpError.forbidden('Credential does not belong to user');
    }
    if (!credential.isActive()) {
      throw ApplicationHttpError.badRequest('Credential is already revoked');
    }

    credential.revoke();
    await this.credentialRepository.update(credential);
  }
}
