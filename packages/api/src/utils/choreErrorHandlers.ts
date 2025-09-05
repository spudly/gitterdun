import {StatusCodes} from 'http-status-codes';
import {z} from 'zod';
import {asError} from '@gitterdun/shared';
import {logger} from './logger';
import type {TypedResponse} from '../types/http';

export const handleUpdateChoreError = (
  error: unknown,
  res: TypedResponse,
): void => {
  if (error instanceof z.ZodError) {
    logger.warn({error}, 'Update chore validation error');
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        success: false as const,
        error: 'Invalid request data',
        details: error.issues,
      });
    return;
  }

  logger.error({error: asError(error)}, 'Update chore error');
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({success: false as const, error: 'Internal server error'});
};

export const handleDeleteChoreError = (
  error: unknown,
  res: TypedResponse,
): void => {
  if (error instanceof Error && error.message === 'Invalid chore ID') {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({success: false as const, error: 'Invalid chore ID'});
    return;
  }

  if (error instanceof Error && error.message === 'Chore not found') {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({success: false as const, error: 'Chore not found'});
    return;
  }

  logger.error({error: asError(error)}, 'Delete chore error');
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({success: false as const, error: 'Internal server error'});
};

export const handleCreateChoreError = (
  error: unknown,
  res: TypedResponse,
): void => {
  if (error instanceof z.ZodError) {
    logger.warn({error}, 'Create chore validation error');
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        success: false,
        error: 'Invalid request data',
        details: error.issues,
      });
    return;
  }

  logger.error({error: asError(error)}, 'Create chore error');
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({success: false, error: 'Internal server error'});
};

export const handleChoreCompletionError = (
  error: unknown,
  res: TypedResponse,
): void => {
  if (error instanceof Error && error.message.includes('not found')) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({success: false as const, error: error.message});
    return;
  }

  if (error instanceof Error && error.message.includes('already completed')) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({success: false as const, error: error.message});
    return;
  }

  logger.error({error: asError(error)}, 'Complete chore error');
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({success: false as const, error: 'Internal server error'});
};
