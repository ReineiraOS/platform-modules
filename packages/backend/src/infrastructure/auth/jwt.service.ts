import { SignJWT, jwtVerify } from 'jose';
import { getEnv } from '../../core/config.js';

export interface JwtTokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  sub: string;
  walletAddress: string;
  walletProvider: string;
  email?: string;
}

export class JwtService {
  private readonly secret: Uint8Array;
  private readonly issuer: string;
  private readonly accessTokenTtl: number;
  private readonly refreshTokenTtl: number;

  constructor() {
    const env = getEnv();
    this.secret = new TextEncoder().encode(env.JWT_SECRET);
    this.issuer = env.JWT_ISSUER;
    this.accessTokenTtl = env.ACCESS_TOKEN_TTL;
    this.refreshTokenTtl = env.REFRESH_TOKEN_TTL;
  }

  async generateTokenPair(payload: JwtPayload): Promise<JwtTokenPair> {
    const now = Math.floor(Date.now() / 1000);

    const accessToken = await new SignJWT({
      walletAddress: payload.walletAddress,
      walletProvider: payload.walletProvider,
      email: payload.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(payload.sub)
      .setIssuer(this.issuer)
      .setIssuedAt(now)
      .setExpirationTime(now + this.accessTokenTtl)
      .sign(this.secret);

    const refreshToken = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(payload.sub)
      .setIssuer(this.issuer)
      .setIssuedAt(now)
      .setExpirationTime(now + this.refreshTokenTtl)
      .sign(this.secret);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenTtl,
    };
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, this.secret, {
      issuer: this.issuer,
    });

    return {
      sub: payload.sub!,
      walletAddress: payload.walletAddress as string,
      walletProvider: payload.walletProvider as string,
      email: payload.email as string | undefined,
    };
  }

  async verifyRefreshToken(token: string): Promise<{ sub: string }> {
    const { payload } = await jwtVerify(token, this.secret, {
      issuer: this.issuer,
    });

    return { sub: payload.sub! };
  }
}
