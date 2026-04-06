import { eq } from 'drizzle-orm';
import type { ISessionRepository } from '../../../domain/auth/repository/session.repository.js';
import { Session } from '../../../domain/auth/model/session.js';
import { sessions } from './schema.js';
import type { Db } from './db.js';

export class PgSessionRepository implements ISessionRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string): Promise<Session | null> {
    const row = await this.db.query.sessions.findFirst({
      where: eq(sessions.id, id),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByRefreshToken(token: string): Promise<Session | null> {
    const row = await this.db.query.sessions.findFirst({
      where: eq(sessions.refreshToken, token),
    });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<Session[]> {
    const rows = await this.db.query.sessions.findMany({
      where: eq(sessions.userId, userId),
    });
    return rows.map((r) => this.toDomain(r));
  }

  async save(session: Session): Promise<void> {
    await this.db.insert(sessions).values({
      id: session.id,
      userId: session.userId,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.id, id));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.userId, userId));
  }

  private toDomain(row: typeof sessions.$inferSelect): Session {
    return new Session({
      id: row.id,
      userId: row.userId,
      refreshToken: row.refreshToken,
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
      userAgent: row.userAgent ?? undefined,
      ipAddress: row.ipAddress ?? undefined,
    });
  }
}
