export class ApplicationHttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApplicationHttpError';
  }

  static badRequest(message: string): ApplicationHttpError {
    return new ApplicationHttpError(400, message);
  }

  static unauthorized(message: string): ApplicationHttpError {
    return new ApplicationHttpError(401, message);
  }

  static forbidden(message: string): ApplicationHttpError {
    return new ApplicationHttpError(403, message);
  }

  static notFound(message: string): ApplicationHttpError {
    return new ApplicationHttpError(404, message);
  }

  static conflict(message: string): ApplicationHttpError {
    return new ApplicationHttpError(409, message);
  }

  static validationError(details: unknown): ApplicationHttpError {
    return new ApplicationHttpError(422, 'Validation failed', details);
  }

  static internalError(message = 'Internal server error'): ApplicationHttpError {
    return new ApplicationHttpError(500, message);
  }
}
