import { RequestNonceDtoSchema } from '../../../../src/application/dto/auth/request-nonce.dto.js';
import { RequestNonceUseCase } from '../../../../src/application/use-case/auth/request-nonce.use-case.js';
import { container } from '../../../../src/infrastructure/container.js';
import { createHandler } from '../../../../src/interface/handler-factory.js';
import { withCors } from '../../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../../src/interface/response.js';

const useCase = new RequestNonceUseCase(container.nonceService);

const handler = createHandler({
  operationName: 'RequestNonce',
  schema: RequestNonceDtoSchema,
  execute: async (dto) => {
    const result = await useCase.execute(dto);
    return Response.ok(result);
  },
});

export default withCors(handler);
