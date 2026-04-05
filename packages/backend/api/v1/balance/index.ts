import { GetBalanceUseCase } from '../../../src/application/use-case/balance/get-balance.use-case.js';
import { createGetHandler } from '../../../src/interface/handler-factory.js';
import { withAuth } from '../../../src/interface/middleware/with-auth.js';
import { withCors } from '../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../src/interface/response.js';

const useCase = new GetBalanceUseCase();

const handler = createGetHandler({
  operationName: 'GetBalance',
  execute: async (_req, authPayload) => {
    const result = await useCase.execute(authPayload!.walletAddress);
    return Response.ok(result);
  },
});

export default withCors(withAuth(handler));
