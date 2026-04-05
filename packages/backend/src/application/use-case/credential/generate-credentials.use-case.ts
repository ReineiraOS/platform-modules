import { randomUUID, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import type { IApiCredentialRepository } from '../../../domain/api-credential/repository/api-credential.repository.js';
import { ApiCredential } from '../../../domain/api-credential/model/api-credential.js';
import type { GenerateCredentialsResponse } from '../../dto/credential/credential.dto.js';

const scryptAsync = promisify(scrypt);

export class GenerateCredentialsUseCase {
  constructor(private readonly credentialRepository: IApiCredentialRepository) {}

  async execute(userId: string): Promise<GenerateCredentialsResponse> {
    const clientId = `rc_${randomUUID().replace(/-/g, '').slice(0, 24)}`;
    const clientSecret = randomBytes(64).toString('hex');
    const salt = randomBytes(32).toString('hex');
    const hashedSecret = ((await scryptAsync(clientSecret, salt, 64)) as Buffer).toString('hex');

    const credential = new ApiCredential({
      id: randomUUID(),
      clientId,
      userId,
      hashedSecret,
      salt,
      status: 'active',
      createdAt: new Date(),
    });

    await this.credentialRepository.save(credential);

    return {
      client_id: clientId,
      client_secret: clientSecret,
      status: credential.status,
      created_at: credential.createdAt.toISOString(),
    };
  }
}
