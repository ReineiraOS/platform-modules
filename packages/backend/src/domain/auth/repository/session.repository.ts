import type { Session } from '../model/session.js';

export interface ISessionRepository {
  findById(id: string): Promise<Session | null>;
  findByRefreshToken(token: string): Promise<Session | null>;
  findByUserId(userId: string): Promise<Session[]>;
  save(session: Session): Promise<void>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
