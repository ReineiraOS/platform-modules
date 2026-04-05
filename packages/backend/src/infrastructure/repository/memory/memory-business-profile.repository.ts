import type { IBusinessProfileRepository } from '../../../domain/business-profile/repository/business-profile.repository.js';
import type { BusinessProfile } from '../../../domain/business-profile/model/business-profile.js';

export class MemoryBusinessProfileRepository implements IBusinessProfileRepository {
  private readonly store = new Map<string, BusinessProfile>();

  async findByUserId(userId: string): Promise<BusinessProfile | null> {
    for (const profile of this.store.values()) {
      if (profile.userId === userId) return profile;
    }
    return null;
  }

  async save(profile: BusinessProfile): Promise<void> {
    this.store.set(profile.id, profile);
  }
}
