import { RefreshTokenDtoSchema } from '../../../../src/application/dto/auth/refresh-token.dto.js';
import { RefreshTokenUseCase } from '../../../../src/application/use-case/auth/refresh-token.use-case.js';
import { container } from '../../../../src/infrastructure/container.js';
import { createHandler } from '../../../../src/interface/handler-factory.js';
import { withCors } from '../../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../../src/interface/response.js';

const useCase = new RefreshTokenUseCase(container.jwtService, container.sessionRepo, container.userRepo);

const handler = createHandler({
  operationName: 'RefreshToken',
  schema: RefreshTokenDtoSchema,
  execute: async (dto) => {
    const result = await useCase.execute(dto);
    return Response.ok(result);
  },
});

export default withCors(handler);
