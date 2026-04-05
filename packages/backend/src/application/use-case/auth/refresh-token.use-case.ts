import { randomUUID } from 'crypto';
import type { ISessionRepository } from '../../../domain/auth/repository/session.repository.js';
import type { IUserRepository } from '../../../domain/auth/repository/user.repository.js';
import { Session } from '../../../domain/auth/model/session.js';
import type { JwtService } from '../../../infrastructure/auth/jwt.service.js';
import { ApplicationHttpError } from '../../../core/errors.js';
import type { RefreshTokenDto } from '../../dto/auth/refresh-token.dto.js';
import type { TokenResponse } from '../../dto/auth/verify-wallet.dto.js';

export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionRepository: ISessionRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<TokenResponse> {
    const payload = await this.jwtService.verifyRefreshToken(dto.refresh_token).catch(() => {
      throw ApplicationHttpError.unauthorized('Invalid refresh token');
    });

    const session = await this.sessionRepository.findByRefreshToken(dto.refresh_token);
    if (!session || session.isExpired()) {
      throw ApplicationHttpError.unauthorized('Session expired or not found');
    }

    const user = await this.userRepository.findById(session.userId);
    if (!user) {
      throw ApplicationHttpError.unauthorized('User not found');
    }

    await this.sessionRepository.delete(session.id);

    const tokenPair = await this.jwtService.generateTokenPair({
      sub: user.id,
      walletAddress: user.walletAddress,
      walletProvider: user.walletProvider,
      email: user.email,
    });

    const newSession = new Session({
      id: randomUUID(),
      userId: user.id,
      refreshToken: tokenPair.refreshToken,
      expiresAt: new Date(Date.now() + tokenPair.expiresIn * 1000),
      createdAt: new Date(),
    });
    await this.sessionRepository.save(newSession);

    return {
      access_token: tokenPair.accessToken,
      refresh_token: tokenPair.refreshToken,
      token_type: 'Bearer',
      expires_in: tokenPair.expiresIn,
    };
  }
}
