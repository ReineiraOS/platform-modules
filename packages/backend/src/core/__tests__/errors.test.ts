import { describe, it, expect } from 'vitest';
import { ApplicationHttpError } from '../errors.js';

describe('ApplicationHttpError', () => {
  describe('constructor', () => {
    it('sets statusCode, message, and name', () => {
      const error = new ApplicationHttpError(400, 'bad input');
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('bad input');
      expect(error.name).toBe('ApplicationHttpError');
    });

    it('sets details when provided', () => {
      const details = { field: 'email', issue: 'required' };
      const error = new ApplicationHttpError(422, 'Validation failed', details);
      expect(error.details).toEqual(details);
    });

    it('leaves details undefined when not provided', () => {
      const error = new ApplicationHttpError(400, 'bad input');
      expect(error.details).toBeUndefined();
    });

    it('is an instance of Error', () => {
      const error = new ApplicationHttpError(500, 'error');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('badRequest', () => {
    it('returns 400 with given message', () => {
      const error = ApplicationHttpError.badRequest('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid input');
      expect(error.name).toBe('ApplicationHttpError');
      expect(error.details).toBeUndefined();
    });
  });

  describe('unauthorized', () => {
    it('returns 401 with given message', () => {
      const error = ApplicationHttpError.unauthorized('Not authenticated');
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Not authenticated');
      expect(error.name).toBe('ApplicationHttpError');
    });
  });

  describe('forbidden', () => {
    it('returns 403 with given message', () => {
      const error = ApplicationHttpError.forbidden('Access denied');
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Access denied');
      expect(error.name).toBe('ApplicationHttpError');
    });
  });

  describe('notFound', () => {
    it('returns 404 with given message', () => {
      const error = ApplicationHttpError.notFound('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Resource not found');
      expect(error.name).toBe('ApplicationHttpError');
    });
  });

  describe('conflict', () => {
    it('returns 409 with given message', () => {
      const error = ApplicationHttpError.conflict('Already exists');
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Already exists');
      expect(error.name).toBe('ApplicationHttpError');
    });
  });

  describe('validationError', () => {
    it('returns 422 with fixed message and provided details', () => {
      const details = [{ path: ['name'], message: 'Required' }];
      const error = ApplicationHttpError.validationError(details);
      expect(error.statusCode).toBe(422);
      expect(error.message).toBe('Validation failed');
      expect(error.details).toEqual(details);
      expect(error.name).toBe('ApplicationHttpError');
    });

    it('accepts any shape as details', () => {
      const error = ApplicationHttpError.validationError('simple string details');
      expect(error.details).toBe('simple string details');
    });
  });

  describe('internalError', () => {
    it('returns 500 with default message', () => {
      const error = ApplicationHttpError.internalError();
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Internal server error');
      expect(error.name).toBe('ApplicationHttpError');
    });

    it('returns 500 with custom message when provided', () => {
      const error = ApplicationHttpError.internalError('Database unavailable');
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Database unavailable');
    });
  });
});
