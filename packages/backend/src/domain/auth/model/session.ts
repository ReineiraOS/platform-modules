export interface SessionParams {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export class Session {
  readonly id: string;
  readonly userId: string;
  readonly refreshToken: string;
  readonly expiresAt: Date;
  readonly createdAt: Date;
  readonly userAgent?: string;
  readonly ipAddress?: string;

  constructor(params: SessionParams) {
    this.id = params.id;
    this.userId = params.userId;
    this.refreshToken = params.refreshToken;
    this.expiresAt = params.expiresAt;
    this.createdAt = params.createdAt;
    this.userAgent = params.userAgent;
    this.ipAddress = params.ipAddress;
  }

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  getTtlSeconds(): number {
    return Math.max(0, Math.floor((this.expiresAt.getTime() - Date.now()) / 1000));
  }
}
