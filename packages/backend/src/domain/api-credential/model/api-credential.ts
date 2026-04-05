export type ApiCredentialStatus = 'active' | 'revoked';

export interface ApiCredentialParams {
  id: string;
  clientId: string;
  userId: string;
  hashedSecret: string;
  salt: string;
  status: ApiCredentialStatus;
  createdAt: Date;
  lastUsedAt?: Date;
}

export class ApiCredential {
  readonly id: string;
  readonly clientId: string;
  readonly userId: string;
  readonly hashedSecret: string;
  readonly salt: string;
  status: ApiCredentialStatus;
  readonly createdAt: Date;
  lastUsedAt?: Date;

  constructor(params: ApiCredentialParams) {
    this.id = params.id;
    this.clientId = params.clientId;
    this.userId = params.userId;
    this.hashedSecret = params.hashedSecret;
    this.salt = params.salt;
    this.status = params.status;
    this.createdAt = params.createdAt;
    this.lastUsedAt = params.lastUsedAt;
  }

  revoke(): this {
    this.status = 'revoked';
    return this;
  }

  touch(): this {
    this.lastUsedAt = new Date();
    return this;
  }

  isActive(): boolean {
    return this.status === 'active';
  }
}
