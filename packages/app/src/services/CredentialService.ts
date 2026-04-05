import { httpClient } from '@/http-client/HttpClient';

export interface Credential {
  client_id: string;
  client_secret_preview: string;
  created_at: string;
}

export interface GenerateCredentialResponse {
  client_id: string;
  client_secret: string;
}

export class CredentialService {
  static async generate(): Promise<GenerateCredentialResponse> {
    const { data } = await httpClient.post<GenerateCredentialResponse>('/v1/credentials');
    return data;
  }

  static async list(): Promise<{ items: Credential[] }> {
    const { data } = await httpClient.get<{ items: Credential[] }>('/v1/credentials');
    return data;
  }

  static async revoke(clientId: string): Promise<void> {
    await httpClient.delete(`/v1/credentials/${clientId}`);
  }
}
