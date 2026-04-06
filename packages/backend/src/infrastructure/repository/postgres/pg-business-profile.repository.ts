import { eq } from 'drizzle-orm';
import type { IBusinessProfileRepository } from '../../../domain/business-profile/repository/business-profile.repository.js';
import {
  BusinessProfile,
  type BusinessType,
} from '../../../domain/business-profile/model/business-profile.js';
import { businessProfiles } from './schema.js';
import type { Db } from './db.js';

export class PgBusinessProfileRepository
  implements IBusinessProfileRepository
{
  constructor(private readonly db: Db) {}

  async findByUserId(userId: string): Promise<BusinessProfile | null> {
    const row = await this.db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId),
    });
    return row ? this.toDomain(row) : null;
  }

  async save(profile: BusinessProfile): Promise<void> {
    await this.db
      .insert(businessProfiles)
      .values({
        id: profile.id,
        userId: profile.userId,
        businessName: profile.businessName,
        businessType: profile.businessType,
        businessAddress: profile.businessAddress,
        taxId: profile.taxId,
      })
      .onConflictDoUpdate({
        target: businessProfiles.userId,
        set: {
          businessName: profile.businessName,
          businessType: profile.businessType,
          businessAddress: profile.businessAddress,
          taxId: profile.taxId,
        },
      });
  }

  private toDomain(
    row: typeof businessProfiles.$inferSelect,
  ): BusinessProfile {
    return new BusinessProfile({
      id: row.id,
      userId: row.userId,
      businessName: row.businessName,
      businessType: row.businessType as BusinessType,
      businessAddress: row.businessAddress ?? undefined,
      taxId: row.taxId ?? undefined,
    });
  }
}
