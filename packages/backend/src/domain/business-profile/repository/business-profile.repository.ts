import type { BusinessProfile } from '../model/business-profile.js';

export interface IBusinessProfileRepository {
  findByUserId(userId: string): Promise<BusinessProfile | null>;
  save(profile: BusinessProfile): Promise<void>;
}
