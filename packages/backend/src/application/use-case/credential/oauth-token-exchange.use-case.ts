import { scrypt } from 'crypto';
import { promisify } from 'util';
import type { IApiCredentialRepository } from '../../../domain/api-credential/repository/api-credential.repository.js';
import type { JwtService } from '../../../infrastructure/auth/jwt.service.js';
import { ApplicationHttpError } from '../../../core/errors.js';
import type { OAuthTokenRequest, OAuthTokenResponse } from '../../dto/credential/credential.dto.js';

const scryptAsync = promisify(scrypt);

export class OAuthTokenExchangeUseCase {
  constructor(
    private readonly credentialRepository: IApiCredentialRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: OAuthTokenRequest): Promise<OAuthTokenResponse> {
    const credential = await this.credentialRepository.findByClientId(dto.client_id);
    if (!credential) {
      throw ApplicationHttpError.unauthorized('Invalid client credentials');
    }
    if (!credential.isActive()) {
      throw ApplicationHttpError.unauthorized('Client credentials have been revoked');
    }

    const hashedInput = ((await scryptAsync(dto.client_secret, credential.salt, 64)) as Buffer).toString('hex');
    if (hashedInput !== credential.hashedSecret) {
      throw ApplicationHttpError.unauthorized('Invalid client credentials');
    }

    credential.touch();
    await this.credentialRepository.update(credential);

    const tokenPair = await this.jwtService.generateTokenPair({
      sub: credential.userId,
      walletAddress: '',
      walletProvider: 'oauth',
    });

    return {
      access_token: tokenPair.accessToken,
      token_type: 'Bearer',
      expires_in: tokenPair.expiresIn,
    };
  }
}
