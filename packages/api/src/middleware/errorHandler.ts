import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils/logger';
import {ZodError} from 'zod';

export const sendZodErrorResponse = (
  res: express.Response,
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

export const sendJsonParseErrorResponse = (res: express.Response): void => {
  res
    .status(StatusCodes.BAD_REQUEST)
    .json({success: false, error: 'Invalid JSON payload'});
};

export const sendErrorResponse = (
  res: express.Response,
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

export const handleErrorInstance = (
  err: Error,
  res: express.Response,
): void => {
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

export const handleError = (err: unknown, res: express.Response): void => {
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
      logger.error({error: err}, 'Error');
    }
    handleErrorInstance(err, res);
    return;
  }

  // Unknown error: log and send 500
  logger.error({error: err}, 'Error');
  sendErrorResponse(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Internal server error',
  );
};

const globalErrorHandler = (
  err: unknown,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
): void => {
  handleError(err, res);
};

export const notFoundHandler = (
  _req: express.Request,
  res: express.Response,
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
