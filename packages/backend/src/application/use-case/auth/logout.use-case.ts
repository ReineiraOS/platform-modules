import type { ISessionRepository } from '../../../domain/auth/repository/session.repository.js';

export class LogoutUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(userId: string): Promise<void> {
    await this.sessionRepository.deleteByUserId(userId);
  }
}
