import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ZodError, type z } from 'zod';
import { ApplicationHttpError } from '../core/errors.js';
import { getLogger } from '../core/logger.js';
import type { AuthPayload } from './auth/auth-payload.js';
import { type HttpResponse, Response } from './response.js';

export type AuthenticatedRequest = VercelRequest & { authPayload?: AuthPayload };

export type VercelHandler = (req: VercelRequest, res: VercelResponse) => Promise<void>;

interface CreateHandlerConfig<TDto, TResult> {
  operationName: string;
  schema: z.ZodSchema<TDto>;
  execute: (dto: TDto, req: AuthenticatedRequest, authPayload?: AuthPayload) => Promise<TResult>;
}

interface CreateGetHandlerConfig<TResult> {
  operationName: string;
  execute: (req: AuthenticatedRequest, authPayload?: AuthPayload) => Promise<TResult>;
}

function isHttpResponse(value: unknown): value is HttpResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'statusCode' in value &&
    'body' in value &&
    typeof (value as HttpResponse).statusCode === 'number' &&
    typeof (value as HttpResponse).body === 'string'
  );
}

export function sendResponse(res: VercelResponse, response: HttpResponse): void {
  const { statusCode, headers, body } = response;

  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }

  if (statusCode === 204) {
    res.status(204).end();
    return;
  }

  res.status(statusCode).end(body);
}

function handleError(error: unknown, operationName: string): HttpResponse {
  const logger = getLogger(operationName);

  if (error instanceof ZodError) {
    return Response.fromZodError(error);
  }

  if (error instanceof ApplicationHttpError) {
    return Response.fromError(error, error.statusCode);
  }

  logger.error({ err: error }, 'Unhandled error');
  return Response.internalServerError();
}

export function createHandler<TDto, TResult>(config: CreateHandlerConfig<TDto, TResult>): VercelHandler {
  const { operationName, schema, execute } = config;

  return async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    try {
      let rawBody: unknown;
      try {
        rawBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } catch {
        sendResponse(res, Response.badRequest('Invalid JSON', 'Request body is not valid JSON'));
        return;
      }

      const dto = schema.parse(rawBody);
      const authReq = req as AuthenticatedRequest;
      const result = await execute(dto, authReq, authReq.authPayload);

      if (isHttpResponse(result)) {
        sendResponse(res, result as HttpResponse);
        return;
      }

      sendResponse(res, Response.ok(result));
    } catch (error) {
      sendResponse(res, handleError(error, operationName));
    }
  };
}

export function createGetHandler<TResult>(config: CreateGetHandlerConfig<TResult>): VercelHandler {
  const { operationName, execute } = config;

  return async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const result = await execute(authReq, authReq.authPayload);

      if (isHttpResponse(result)) {
        sendResponse(res, result as HttpResponse);
        return;
      }

      sendResponse(res, Response.ok(result));
    } catch (error) {
      sendResponse(res, handleError(error, operationName));
    }
  };
}
