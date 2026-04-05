import { CreateBusinessProfileDtoSchema } from '../../../src/application/dto/business-profile/create-business-profile.dto.js';
import { CreateBusinessProfileUseCase } from '../../../src/application/use-case/business-profile/create-business-profile.use-case.js';
import { container } from '../../../src/infrastructure/container.js';
import { createHandler } from '../../../src/interface/handler-factory.js';
import { withAuth } from '../../../src/interface/middleware/with-auth.js';
import { withCors } from '../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../src/interface/response.js';

const useCase = new CreateBusinessProfileUseCase(container.businessProfileRepo);

const handler = createHandler({
  operationName: 'CreateBusinessProfile',
  schema: CreateBusinessProfileDtoSchema,
  execute: async (dto, _req, authPayload) => {
    const result = await useCase.execute(dto, authPayload!.userId);
    return Response.created(result);
  },
});

export default withCors(withAuth(handler));
