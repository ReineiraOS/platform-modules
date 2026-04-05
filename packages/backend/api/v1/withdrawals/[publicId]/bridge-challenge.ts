import { CreateBridgeChallengeUseCase } from '../../../../src/application/use-case/withdrawal/create-bridge-challenge.use-case.js';
import { container } from '../../../../src/infrastructure/container.js';
import { createGetHandler } from '../../../../src/interface/handler-factory.js';
import { withAuth } from '../../../../src/interface/middleware/with-auth.js';
import { withCors } from '../../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../../src/interface/response.js';

const useCase = new CreateBridgeChallengeUseCase(container.withdrawalRepo);

const handler = createGetHandler({
  operationName: 'CreateBridgeChallenge',
  execute: async (req, authPayload) => {
    const publicId = req.query.publicId as string;
    const result = await useCase.execute(publicId, authPayload!.userId);
    return Response.ok(result);
  },
});

export default withCors(withAuth(handler));
