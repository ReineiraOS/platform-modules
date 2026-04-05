import type { User } from '../model/user.js';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByWalletAddress(address: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
