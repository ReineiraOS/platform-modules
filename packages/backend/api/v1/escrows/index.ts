import type { VercelRequest, VercelResponse } from '@vercel/node';
import { CreateEscrowDtoSchema } from '../../../src/application/dto/escrow/create-escrow.dto.js';
import {
  CreateEscrowUseCase,
  type EncryptionMode,
} from '../../../src/application/use-case/escrow/create-escrow.use-case.js';
import { GetEscrowsUseCase } from '../../../src/application/use-case/escrow/get-escrows.use-case.js';
import { container } from '../../../src/infrastructure/container.js';
import { createHandler, createGetHandler, sendResponse } from '../../../src/interface/handler-factory.js';
import { withAuth } from '../../../src/interface/middleware/with-auth.js';
import { withCors } from '../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../src/interface/response.js';

const createEscrowUseCase = new CreateEscrowUseCase(container.fheService, container.escrowRepo);
const getEscrowsUseCase = new GetEscrowsUseCase(container.escrowRepo);

const postHandler = createHandler({
  operationName: 'CreateEscrow',
  schema: CreateEscrowDtoSchema,
  execute: async (dto, req, authPayload) => {
    const encryptionMode =
      (req.headers['x-encryption-mode'] as string)?.toLowerCase() === 'client'
        ? ('client' as EncryptionMode)
        : ('server' as EncryptionMode);
    const result = await createEscrowUseCase.execute(
      dto,
      authPayload!.userId,
      authPayload!.walletAddress,
      encryptionMode,
    );
    return Response.created(result);
  },
});

const getHandler = createGetHandler({
  operationName: 'GetEscrows',
  execute: async (req, authPayload) => {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const cursor = req.query.continuation_token as string | undefined;
    const status = req.query.status as string | undefined;
    const result = await getEscrowsUseCase.execute(authPayload!.userId, {
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
