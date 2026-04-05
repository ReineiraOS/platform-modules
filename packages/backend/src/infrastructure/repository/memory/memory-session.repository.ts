import type { ISessionRepository } from '../../../domain/auth/repository/session.repository.js';
import type { Session } from '../../../domain/auth/model/session.js';

export class MemorySessionRepository implements ISessionRepository {
  private readonly store = new Map<string, Session>();

  async findById(id: string): Promise<Session | null> {
    return this.store.get(id) ?? null;
  }

  async findByRefreshToken(token: string): Promise<Session | null> {
    for (const session of this.store.values()) {
      if (session.refreshToken === token) return session;
    }
    return null;
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return [...this.store.values()].filter((s) => s.userId === userId);
  }

  async save(session: Session): Promise<void> {
    this.store.set(session.id, session);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    for (const [id, session] of this.store) {
      if (session.userId === userId) this.store.delete(id);
    }
  }
}
