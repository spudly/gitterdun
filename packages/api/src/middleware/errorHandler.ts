import express from 'express';
import {logger} from '../utils/logger';
import {ZodError} from 'zod';

const sendZodErrorResponse = (res: express.Response, err: ZodError): void => {
  const isProd = process.env['NODE_ENV'] === 'production';
  res
    .status(400)
    .json(
      isProd
        ? {success: false, error: 'Invalid request data'}
        : {success: false, error: 'Invalid request data', details: err.issues},
    );
};

const sendJsonParseErrorResponse = (res: express.Response): void => {
  res.status(400).json({success: false, error: 'Invalid JSON payload'});
};

const sendErrorResponse = (
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

const handleErrorInstance = (err: Error, res: express.Response): void => {
  const errorObj = err as Error & {type?: string; status?: number};

  if (errorObj.type === 'entity.parse.failed') {
    sendJsonParseErrorResponse(res);
    return;
  }

  sendErrorResponse(res, errorObj.status ?? 500, errorObj.message);
};

const handleError = (err: unknown, res: express.Response): void => {
  logger.error({error: err}, 'Error');

  if (err instanceof ZodError) {
    sendZodErrorResponse(res, err);
    return;
  }

  if (err instanceof Error) {
    handleErrorInstance(err, res);
    return;
  }

  sendErrorResponse(res, 500, 'Internal server error');
};

const globalErrorHandler = (
  err: unknown,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
): void => {
  handleError(err, res);
};

const notFoundHandler = (
  _req: express.Request,
  res: express.Response,
): void => {
  res.status(404).json({success: false, error: 'API endpoint not found'});
};

export const setupErrorHandling = (app: express.Express): void => {
  app.use(globalErrorHandler);
  // Catch-all 404 for any /api/* path not already handled
  app.use('/api', notFoundHandler);
};
