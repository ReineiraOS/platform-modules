import type { VercelRequest, VercelResponse } from '@vercel/node';
import { RelayCallbackUseCase } from '../../../src/application/use-case/webhook/relay-callback.use-case.js';
import { container } from '../../../src/infrastructure/container.js';
import { sendResponse } from '../../../src/interface/handler-factory.js';
import { withCors } from '../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../src/interface/response.js';

const useCase = new RelayCallbackUseCase(container.withdrawalRepo);

const handler = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    sendResponse(res, Response.badRequest('Method not allowed'));
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    await useCase.execute(body);
    sendResponse(res, Response.ok({ received: true }));
  } catch {
    sendResponse(res, Response.internalServerError());
  }
};

export default withCors(handler);
