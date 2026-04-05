import { httpClient } from '@/http-client/HttpClient';

export interface CreateBusinessProfileRequest {
  business_name: string;
  business_type: string;
  country: string;
  website?: string;
}

export interface BusinessProfileResponse {
  id: string;
  business_name: string;
  business_type: string;
  country: string;
  website?: string;
  status: string;
  created_at: string;
}

export class BusinessProfileService {
  static async create(dto: CreateBusinessProfileRequest): Promise<BusinessProfileResponse> {
    const { data } = await httpClient.post<BusinessProfileResponse>('/v1/business-profiles', dto);
    return data;
  }
}
