import type express from 'express';
import type {RequestDefault, TypedResponse} from '../types/http.js';
import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils/logger.js';
import {ZodError} from 'zod';
import {asError} from '@gitterdun/shared';

export const sendZodErrorResponse = (
  res: TypedResponse,
  err: ZodError,
): void => {
  const isProd = process.env['NODE_ENV'] === 'production';
  res
    .status(StatusCodes.BAD_REQUEST)
    .json(
      isProd
        ? {success: false, error: 'Invalid request data'}
        : {success: false, error: 'Invalid request data', details: err.issues},
    );
};

export const sendJsonParseErrorResponse = (res: TypedResponse): void => {
  res
    .status(StatusCodes.BAD_REQUEST)
    .json({success: false, error: 'Invalid JSON payload'});
};

export const sendErrorResponse = (
  res: TypedResponse,
  status: number,
  message: string,
): void => {
  res
    .status(status)
    .json({
      success: false,
      error:
        process.env['NODE_ENV'] === 'production'
          ? 'Internal server error'
          : message,
    });
};

export const handleErrorInstance = (err: Error, res: TypedResponse): void => {
  const errorObj = err as Error & {type?: string; status?: number};

  if (errorObj.type === 'entity.parse.failed') {
    sendJsonParseErrorResponse(res);
    return;
  }

  sendErrorResponse(
    res,
    errorObj.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
    errorObj.message,
  );
};

const SERVER_ERROR_MIN: number = StatusCodes.INTERNAL_SERVER_ERROR;
const isServerErrorStatus = (code: number): boolean => code >= SERVER_ERROR_MIN;

export const handleError = (err: unknown, res: TypedResponse): void => {
  if (err instanceof ZodError) {
    // 400 level validation error: do not log
    sendZodErrorResponse(res, err);
    return;
  }

  if (err instanceof Error) {
    const status =
      (err as Error & {status?: number}).status
      ?? StatusCodes.INTERNAL_SERVER_ERROR;
    if (isServerErrorStatus(status)) {
      logger.error({error: asError(err)}, 'Error');
    }
    handleErrorInstance(err, res);
    return;
  }

  // Unknown error: log and send 500
  logger.error({error: asError(err)}, 'Error');
  sendErrorResponse(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Internal server error',
  );
};

const globalErrorHandler = (
  err: unknown,
  _req: RequestDefault,
  res: TypedResponse,
  _next: express.NextFunction,
): void => {
  handleError(err, res);
};

export const notFoundHandler = (
  _req: RequestDefault,
  res: TypedResponse,
): void => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({success: false, error: 'API endpoint not found'});
};

export const setupErrorHandling = (app: express.Express): void => {
  app.use(globalErrorHandler);
  // Catch-all 404 for any /api/* path not already handled
  app.use('/api', notFoundHandler);
};
