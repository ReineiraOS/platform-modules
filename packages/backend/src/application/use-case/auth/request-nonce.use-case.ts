import type { NonceService } from '../../../infrastructure/auth/nonce.service.js';
import type { RequestNonceDto, RequestNonceResponse } from '../../dto/auth/request-nonce.dto.js';

export class RequestNonceUseCase {
  constructor(private readonly nonceService: NonceService) {}

  async execute(dto: RequestNonceDto): Promise<RequestNonceResponse> {
    const nonce = await this.nonceService.generateNonce(dto.wallet_address);
    return { nonce };
  }
}
