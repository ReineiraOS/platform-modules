import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GenerateCredentialsUseCase } from '../../../src/application/use-case/credential/generate-credentials.use-case.js';
import { GetCredentialsUseCase } from '../../../src/application/use-case/credential/get-credentials.use-case.js';
import { container } from '../../../src/infrastructure/container.js';
import { createGetHandler, sendResponse } from '../../../src/interface/handler-factory.js';
import { withAuth } from '../../../src/interface/middleware/with-auth.js';
import { withCors } from '../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../src/interface/response.js';

const generateUseCase = new GenerateCredentialsUseCase(container.apiCredentialRepo);
const getUseCase = new GetCredentialsUseCase(container.apiCredentialRepo);

const postHandler = createGetHandler({
  operationName: 'GenerateCredentials',
  execute: async (_req, authPayload) => {
    const result = await generateUseCase.execute(authPayload!.userId);
    return Response.created(result);
  },
});

const getHandler = createGetHandler({
  operationName: 'GetCredentials',
  execute: async (_req, authPayload) => {
    const result = await getUseCase.execute(authPayload!.userId);
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
