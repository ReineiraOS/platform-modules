import type { VercelRequest, VercelResponse } from '@vercel/node';
import { jwtVerify } from 'jose';
import { getEnv } from '../../core/config.js';
import type { AuthPayload } from '../auth/auth-payload.js';
import type { AuthenticatedRequest, VercelHandler } from '../handler-factory.js';
import { Response, type HttpResponse } from '../response.js';
import { sendResponse } from '../handler-factory.js';

function extractBearerToken(req: VercelRequest): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }
  return header.slice(7);
}

export function withAuth(handler: VercelHandler): VercelHandler {
  return async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    const token = extractBearerToken(req);

    if (!token) {
      sendResponse(res, Response.unauthorized('Missing authorization', 'Bearer token is required'));
      return;
    }

    try {
      const { JWT_SECRET, JWT_ISSUER } = getEnv();
      const secret = new TextEncoder().encode(JWT_SECRET);

      const { payload } = await jwtVerify(token, secret, {
        issuer: JWT_ISSUER,
      });

      (req as AuthenticatedRequest).authPayload = payload as unknown as AuthPayload;
    } catch {
      sendResponse(res, Response.unauthorized('Invalid token', 'Token verification failed'));
      return;
    }

    return handler(req, res);
  };
}
