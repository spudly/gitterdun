import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {z} from 'zod';
import {asError} from '@gitterdun/shared';
import {logger} from './logger';

export const handleChoresQueryError = (
  error: unknown,
  res: express.Response,
) => {
  if (error instanceof z.ZodError) {
    logger.warn({error}, 'Chores query validation error');
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        success: false as const,
        error: 'Invalid query parameters',
        details: error.stack,
      });
  }

  logger.error({error: asError(error)}, 'Get chores error');
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({success: false as const, error: 'Internal server error'});
};

export const handleGetChoreError = (error: unknown, res: express.Response) => {
  if (error instanceof Error && error.message === 'Invalid chore ID') {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({success: false as const, error: 'Invalid chore ID'});
  }

  if (error instanceof Error && error.message === 'Chore not found') {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({success: false as const, error: 'Chore not found'});
  }

  logger.error({error: asError(error)}, 'Get chore error');
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({success: false as const, error: 'Internal server error'});
};

export const handleUpdateChoreError = (
  error: unknown,
  res: express.Response,
) => {
  if (error instanceof z.ZodError) {
    logger.warn({error}, 'Update chore validation error');
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        success: false as const,
        error: 'Invalid request data',
        details: error.stack,
      });
  }

  logger.error({error: asError(error)}, 'Update chore error');
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({success: false as const, error: 'Internal server error'});
};

export const handleDeleteChoreError = (
  error: unknown,
  res: express.Response,
) => {
  if (error instanceof Error && error.message === 'Invalid chore ID') {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({success: false as const, error: 'Invalid chore ID'});
  }

  if (error instanceof Error && error.message === 'Chore not found') {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({success: false as const, error: 'Chore not found'});
  }

  logger.error({error: asError(error)}, 'Delete chore error');
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({success: false as const, error: 'Internal server error'});
};

export const handleCreateChoreError = (
  error: unknown,
  res: express.Response,
) => {
  if (error instanceof z.ZodError) {
    logger.warn({error}, 'Create chore validation error');
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        success: false,
        error: 'Invalid request data',
        details: error.stack,
      });
  }

  logger.error({error: asError(error)}, 'Create chore error');
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({success: false, error: 'Internal server error'});
};

export const handleChoreCompletionError = (
  error: unknown,
  res: express.Response,
) => {
  if (error instanceof Error && error.message.includes('not found')) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({success: false as const, error: error.message});
  }

  if (error instanceof Error && error.message.includes('already completed')) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({success: false as const, error: error.message});
  }

  logger.error({error: asError(error)}, 'Complete chore error');
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({success: false as const, error: 'Internal server error'});
};
