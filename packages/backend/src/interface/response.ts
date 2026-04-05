import { ZodError } from 'zod';
import { getEnv } from '../core/config.js';
import { ErrorResponseDtoFactory } from './dto/error-response.dto.js';

export interface HttpResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

function getSafeOrigin(): string {
  try {
    return getEnv().ALLOWED_ORIGINS;
  } catch {
    return '*';
  }
}

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': getSafeOrigin(),
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function defaultHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...corsHeaders(),
  };
}

export const Response = {
  ok(data: unknown): HttpResponse {
    return {
      statusCode: 200,
      headers: defaultHeaders(),
      body: JSON.stringify(data),
    };
  },

  created(data: unknown): HttpResponse {
    return {
      statusCode: 201,
      headers: defaultHeaders(),
      body: JSON.stringify(data),
    };
  },

  noContent(): HttpResponse {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: '',
    };
  },

  badRequest(title: string, detail?: string): HttpResponse {
    return {
      statusCode: 400,
      headers: defaultHeaders(),
      body: JSON.stringify(ErrorResponseDtoFactory.create(400, title, detail)),
    };
  },

  unauthorized(title: string, detail?: string): HttpResponse {
    return {
      statusCode: 401,
      headers: defaultHeaders(),
      body: JSON.stringify(ErrorResponseDtoFactory.create(401, title, detail)),
    };
  },

  notFound(title: string, detail?: string): HttpResponse {
    return {
      statusCode: 404,
      headers: defaultHeaders(),
      body: JSON.stringify(ErrorResponseDtoFactory.create(404, title, detail)),
    };
  },

  conflict(title: string, detail?: string): HttpResponse {
    return {
      statusCode: 409,
      headers: defaultHeaders(),
      body: JSON.stringify(ErrorResponseDtoFactory.create(409, title, detail)),
    };
  },

  unprocessableEntity(
    title: string,
    invalidParams?: Array<{ name: string; reason: string }>,
    detail?: string,
  ): HttpResponse {
    const body = invalidParams
      ? ErrorResponseDtoFactory.createValidation(title, invalidParams, detail)
      : ErrorResponseDtoFactory.create(422, title, detail);

    return {
      statusCode: 422,
      headers: defaultHeaders(),
      body: JSON.stringify(body),
    };
  },

  fromZodError(error: ZodError): HttpResponse {
    return {
      statusCode: 422,
      headers: defaultHeaders(),
      body: JSON.stringify(ErrorResponseDtoFactory.fromZodError(error)),
    };
  },

  fromError(error: Error, statusCode = 500): HttpResponse {
    return {
      statusCode,
      headers: defaultHeaders(),
      body: JSON.stringify(ErrorResponseDtoFactory.fromError(error, statusCode)),
    };
  },

  internalServerError(title = 'Internal server error', detail?: string): HttpResponse {
    return {
      statusCode: 500,
      headers: defaultHeaders(),
      body: JSON.stringify(ErrorResponseDtoFactory.create(500, title, detail)),
    };
  },
};
