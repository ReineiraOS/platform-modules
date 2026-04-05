import type { VercelRequest, VercelResponse } from '@vercel/node';
import { CreateWithdrawalDtoSchema } from '../../../src/application/dto/withdrawal/create-withdrawal.dto.js';
import { CreateWithdrawalUseCase } from '../../../src/application/use-case/withdrawal/create-withdrawal.use-case.js';
import { GetWithdrawalsUseCase } from '../../../src/application/use-case/withdrawal/get-withdrawals.use-case.js';
import { container } from '../../../src/infrastructure/container.js';
import { createHandler, createGetHandler, sendResponse } from '../../../src/interface/handler-factory.js';
import { withAuth } from '../../../src/interface/middleware/with-auth.js';
import { withCors } from '../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../src/interface/response.js';

const createWithdrawalUseCase = new CreateWithdrawalUseCase(container.escrowRepo, container.withdrawalRepo);
const getWithdrawalsUseCase = new GetWithdrawalsUseCase(container.withdrawalRepo);

const postHandler = createHandler({
  operationName: 'CreateWithdrawal',
  schema: CreateWithdrawalDtoSchema,
  execute: async (dto, _req, authPayload) => {
    const result = await createWithdrawalUseCase.execute(dto, authPayload!.userId, authPayload!.walletAddress);
    return Response.created(result);
  },
});

const getHandler = createGetHandler({
  operationName: 'GetWithdrawals',
  execute: async (req, authPayload) => {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const cursor = req.query.continuation_token as string | undefined;
    const status = req.query.status as string | undefined;
    const result = await getWithdrawalsUseCase.execute(authPayload!.userId, {
      limit,
      cursor,
      status,
    });
    return Response.ok(result);
  },
});

const handler = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method === 'POST') {
    return postHandler(req, res);
  }
  if (req.method === 'GET') {
    return getHandler(req, res);
  }
  sendResponse(res, Response.badRequest('Method not allowed'));
};

export default withCors(withAuth(handler));
