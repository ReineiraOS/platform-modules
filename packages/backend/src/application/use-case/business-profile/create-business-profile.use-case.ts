import { randomUUID } from 'crypto';
import type { IBusinessProfileRepository } from '../../../domain/business-profile/repository/business-profile.repository.js';
import { BusinessProfile } from '../../../domain/business-profile/model/business-profile.js';
import type {
  CreateBusinessProfileDto,
  BusinessProfileResponse,
} from '../../dto/business-profile/create-business-profile.dto.js';

export class CreateBusinessProfileUseCase {
  constructor(private readonly businessProfileRepository: IBusinessProfileRepository) {}

  async execute(dto: CreateBusinessProfileDto, userId: string): Promise<BusinessProfileResponse> {
    const profile = new BusinessProfile({
      id: randomUUID(),
      userId,
      businessName: dto.business_name,
      businessType: dto.business_type,
      businessAddress: dto.business_address,
      taxId: dto.tax_id,
    });

    await this.businessProfileRepository.save(profile);

    return {
      id: profile.id,
      business_name: profile.businessName,
      business_type: profile.businessType,
      business_address: profile.businessAddress,
      tax_id: profile.taxId,
    };
  }
}
