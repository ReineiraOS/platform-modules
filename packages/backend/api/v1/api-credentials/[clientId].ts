import type { VercelRequest, VercelResponse } from '@vercel/node';
import { RevokeCredentialsUseCase } from '../../../src/application/use-case/credential/revoke-credentials.use-case.js';
import { container } from '../../../src/infrastructure/container.js';
import type { AuthenticatedRequest } from '../../../src/interface/handler-factory.js';
import { sendResponse } from '../../../src/interface/handler-factory.js';
import { withAuth } from '../../../src/interface/middleware/with-auth.js';
import { withCors } from '../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../src/interface/response.js';

const useCase = new RevokeCredentialsUseCase(container.apiCredentialRepo);

const handler = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'DELETE') {
    sendResponse(res, Response.badRequest('Method not allowed'));
    return;
  }

  try {
    const clientId = req.query.clientId as string;
    const authReq = req as AuthenticatedRequest;
    await useCase.execute(clientId, authReq.authPayload!.userId);
    sendResponse(res, Response.noContent());
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      sendResponse(res, Response.fromError(error, (error as { statusCode: number }).statusCode));
      return;
    }
    sendResponse(res, Response.internalServerError());
  }
};

export default withCors(withAuth(handler));
