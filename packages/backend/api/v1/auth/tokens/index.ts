import { LogoutUseCase } from '../../../../src/application/use-case/auth/logout.use-case.js';
import { container } from '../../../../src/infrastructure/container.js';
import { createGetHandler } from '../../../../src/interface/handler-factory.js';
import { withAuth } from '../../../../src/interface/middleware/with-auth.js';
import { withCors } from '../../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../../src/interface/response.js';

const useCase = new LogoutUseCase(container.sessionRepo);

const handler = createGetHandler({
  operationName: 'Logout',
  execute: async (_req, authPayload) => {
    await useCase.execute(authPayload!.userId);
    return Response.noContent();
  },
});

export default withCors(withAuth(handler));
