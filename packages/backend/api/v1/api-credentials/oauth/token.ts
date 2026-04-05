import { OAuthTokenRequestSchema } from '../../../../src/application/dto/credential/credential.dto.js';
import { OAuthTokenExchangeUseCase } from '../../../../src/application/use-case/credential/oauth-token-exchange.use-case.js';
import { container } from '../../../../src/infrastructure/container.js';
import { createHandler } from '../../../../src/interface/handler-factory.js';
import { withCors } from '../../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../../src/interface/response.js';

const useCase = new OAuthTokenExchangeUseCase(container.apiCredentialRepo, container.jwtService);

const handler = createHandler({
  operationName: 'OAuthTokenExchange',
  schema: OAuthTokenRequestSchema,
  execute: async (dto) => {
    const result = await useCase.execute(dto);
    return Response.ok(result);
  },
});

export default withCors(handler);
