import { randomUUID } from 'crypto';
import { SiweMessage } from 'siwe';
import type { ISessionRepository } from '../../../domain/auth/repository/session.repository.js';
import type { IUserRepository } from '../../../domain/auth/repository/user.repository.js';
import { Session } from '../../../domain/auth/model/session.js';
import { User } from '../../../domain/auth/model/user.js';
import type { JwtService } from '../../../infrastructure/auth/jwt.service.js';
import type { NonceService } from '../../../infrastructure/auth/nonce.service.js';
import type { SiweVerifier } from '../../../infrastructure/auth/siwe-verifier.js';
import { ApplicationHttpError } from '../../../core/errors.js';
import type { VerifyWalletDto } from '../../dto/auth/verify-wallet.dto.js';
import type { TokenResponse } from '../../dto/auth/verify-wallet.dto.js';

export class VerifyWalletUseCase {
  constructor(
    private readonly siweVerifier: SiweVerifier,
    private readonly nonceService: NonceService,
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: VerifyWalletDto): Promise<TokenResponse> {
    const result = await this.siweVerifier.verify(dto.message, dto.signature);
    if (!result.valid) {
      throw ApplicationHttpError.unauthorized('Invalid SIWE signature');
    }

    const siweMessage = new SiweMessage(dto.message);
    const nonceValid = await this.nonceService.verifyNonce(dto.wallet_address, siweMessage.nonce);
    if (!nonceValid) {
      throw ApplicationHttpError.unauthorized('Invalid or expired nonce');
    }

    let user = await this.userRepository.findByWalletAddress(dto.wallet_address);
    if (!user) {
      user = new User({
        id: randomUUID(),
        walletAddress: dto.wallet_address,
        walletProvider: 'walletconnect',
        email: dto.email,
        createdAt: new Date(),
      });
      await this.userRepository.save(user);
    }

    const tokenPair = await this.jwtService.generateTokenPair({
      sub: user.id,
      walletAddress: user.walletAddress,
      walletProvider: user.walletProvider,
      email: user.email,
    });

    const session = new Session({
      id: randomUUID(),
      userId: user.id,
      refreshToken: tokenPair.refreshToken,
      expiresAt: new Date(Date.now() + tokenPair.expiresIn * 1000),
      createdAt: new Date(),
    });
    await this.sessionRepository.save(session);

    return {
      access_token: tokenPair.accessToken,
      refresh_token: tokenPair.refreshToken,
      token_type: 'Bearer',
      expires_in: tokenPair.expiresIn,
    };
  }
}
