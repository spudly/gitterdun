import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import express from 'express';
import {ZodError} from 'zod';
import {
  sendZodErrorResponse,
  sendJsonParseErrorResponse,
  sendErrorResponse,
  handleErrorInstance,
  handleError,
  notFoundHandler,
} from './errorHandler';

// Mock the logger
jest.mock('../utils/logger', () => ({logger: {error: jest.fn()}}));

describe('errorHandler', () => {
  let res: Partial<express.Response>;
  let req: Partial<express.Request>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn<express.Response['json']>().mockReturnThis();
    statusMock = jest.fn<express.Response['status']>().mockReturnThis();
    res = {status: statusMock, json: jsonMock};
    req = {method: 'GET', url: '/test'};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendZodErrorResponse', () => {
    test('should return status 400 for ZodError in development', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';

      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['name'],
          message: 'Expected string, received number',
        },
      ]);

      sendZodErrorResponse(res as express.Response, zodError);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid request data',
        details: zodError.issues,
      });

      process.env['NODE_ENV'] = originalEnv;
    });

    test('should return status 400 for ZodError in production without details', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'production';

      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['name'],
          message: 'Expected string, received number',
        },
      ]);

      sendZodErrorResponse(res as express.Response, zodError);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid request data',
      });

      process.env['NODE_ENV'] = originalEnv;
    });
  });

  describe('sendJsonParseErrorResponse', () => {
    test('should return status 400 for JSON parse errors', () => {
      sendJsonParseErrorResponse(res as express.Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid JSON payload',
      });
    });
  });

  describe('sendErrorResponse', () => {
    test('should return custom status code and message in development', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';

      sendErrorResponse(res as express.Response, 404, 'Not found');

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Not found',
      });

      process.env['NODE_ENV'] = originalEnv;
    });

    test('should return custom status code but generic message in production', () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'production';

      sendErrorResponse(res as express.Response, 404, 'Not found');

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });

      process.env['NODE_ENV'] = originalEnv;
    });
  });

  describe('handleErrorInstance', () => {
    test('should handle JSON parse errors with status 400', () => {
      const parseError = new Error('Invalid JSON') as Error & {type: string};
      parseError.type = 'entity.parse.failed';

      handleErrorInstance(parseError, res as express.Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid JSON payload',
      });
    });

    test('should use custom status code when Error has status property', () => {
      const customError = new Error('Not found') as Error & {status: number};
      customError.status = 404;

      handleErrorInstance(customError, res as express.Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    test('should return status 500 when Error has no status property', () => {
      const genericError = new Error('Something went wrong');

      handleErrorInstance(genericError, res as express.Response);

      expect(statusMock).toHaveBeenCalledWith(500);
    });
  });

  describe('handleError', () => {
    test('should handle ZodError with status 400', () => {
      const zodError = new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['name'],
          message: 'Expected string, received number',
        },
      ]);

      handleError(zodError, res as express.Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    test('should handle Error instances', () => {
      const error = new Error('Test error');

      handleError(error, res as express.Response);

      expect(statusMock).toHaveBeenCalledWith(500);
    });

    test('should handle unknown errors with status 500', () => {
      const unknownError = 'string error';

      handleError(unknownError, res as express.Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('notFoundHandler', () => {
    test('should return status 404 for unmatched /api routes', () => {
      notFoundHandler(req as express.Request, res as express.Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'API endpoint not found',
      });
    });
  });
});
