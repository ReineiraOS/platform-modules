import type { IUserRepository } from '../../../domain/auth/repository/user.repository.js';
import { ApplicationHttpError } from '../../../core/errors.js';

export interface UserResponse {
  id: string;
  wallet_address: string;
  wallet_provider: string;
  email?: string;
  created_at: string;
}

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw ApplicationHttpError.notFound('User not found');
    }

    return {
      id: user.id,
      wallet_address: user.walletAddress,
      wallet_provider: user.walletProvider,
      email: user.email,
      created_at: user.createdAt.toISOString(),
    };
  }
}
