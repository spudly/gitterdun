import express from 'express';
import {z} from 'zod';
import {asError} from '@gitterdun/shared';
import {logger} from './logger';

type ErrorWithStatus = {status?: number; message?: string};

const isErrorWithStatus = (error: unknown): error is ErrorWithStatus => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

const getErrorStatus = (error: unknown): number => {
  if (isErrorWithStatus(error) && typeof error.status === 'number') {
    return error.status;
  }
  return 500;
};

const getErrorMessage = (error: unknown): string => {
  const errorObj = asError(error);

  if (isErrorWithStatus(error) && typeof error.message === 'string') {
    return error.message;
  }

  return errorObj.message || 'Internal server error';
};

export const handleRouteError = (
  res: express.Response,
  error: unknown,
  operation: string,
): express.Response => {
  if (error instanceof z.ZodError) {
    logger.warn({error}, `${operation} validation error`);
    const errorMessage = operation.toLowerCase().includes('get')
      ? 'Invalid query parameters'
      : 'Invalid request data';
    return res
      .status(400)
      .json({success: false, error: errorMessage, details: error.stack});
  }

  const status = getErrorStatus(error);
  const message = getErrorMessage(error);
  logger.error({error: asError(error)}, `${operation} error`);
  return res.status(status).json({success: false, error: message});
};
