import { eq } from 'drizzle-orm';
import type { IApiCredentialRepository } from '../../../domain/api-credential/repository/api-credential.repository.js';
import {
  ApiCredential,
  type ApiCredentialStatus,
} from '../../../domain/api-credential/model/api-credential.js';
import { apiCredentials } from './schema.js';
import type { Db } from './db.js';

export class PgApiCredentialRepository implements IApiCredentialRepository {
  constructor(private readonly db: Db) {}

  async findByClientId(clientId: string): Promise<ApiCredential | null> {
    const row = await this.db.query.apiCredentials.findFirst({
      where: eq(apiCredentials.clientId, clientId),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<ApiCredential[]> {
    const rows = await this.db.query.apiCredentials.findMany({
      where: eq(apiCredentials.userId, userId),
    });
    return rows.map((r) => this.toDomain(r));
  }

  async save(credential: ApiCredential): Promise<void> {
    await this.db.insert(apiCredentials).values({
      id: credential.id,
      clientId: credential.clientId,
      userId: credential.userId,
      hashedSecret: credential.hashedSecret,
      salt: credential.salt,
      status: credential.status,
      createdAt: credential.createdAt,
      lastUsedAt: credential.lastUsedAt,
    });
  }

  async update(credential: ApiCredential): Promise<void> {
    await this.db
      .update(apiCredentials)
      .set({
        status: credential.status,
        lastUsedAt: credential.lastUsedAt,
      })
      .where(eq(apiCredentials.id, credential.id));
  }

  private toDomain(row: typeof apiCredentials.$inferSelect): ApiCredential {
    return new ApiCredential({
      id: row.id,
      clientId: row.clientId,
      userId: row.userId,
      hashedSecret: row.hashedSecret,
      salt: row.salt,
      status: row.status as ApiCredentialStatus,
      createdAt: row.createdAt,
      lastUsedAt: row.lastUsedAt ?? undefined,
    });
  }
}
