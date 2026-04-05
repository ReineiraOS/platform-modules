import type { IUserRepository } from '../../../domain/auth/repository/user.repository.js';
import type { User } from '../../../domain/auth/model/user.js';

export class MemoryUserRepository implements IUserRepository {
  private readonly store = new Map<string, User>();

  async findById(id: string): Promise<User | null> {
    return this.store.get(id) ?? null;
  }

  async findByWalletAddress(address: string): Promise<User | null> {
    for (const user of this.store.values()) {
      if (user.walletAddress === address) return user;
    }
    return null;
  }

  async save(user: User): Promise<void> {
    this.store.set(user.id, user);
  }
}
