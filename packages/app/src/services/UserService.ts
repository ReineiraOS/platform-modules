import { httpClient } from '@/http-client/HttpClient';

export interface UserProfile {
  id: string;
  wallet_address: string;
  wallet_provider: string;
  email?: string;
  created_at: string;
}

export class UserService {
  static async getCurrentUser(): Promise<UserProfile> {
    const { data } = await httpClient.get<UserProfile>('/v1/users/me');
    return data;
  }
}
