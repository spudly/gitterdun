import express from 'express';
import {processChoresRequest} from '../utils/choreQueries';
import {
  parseChoresQueryRequest,
  parseGetChoreRequest,
  validateGetChoreInput,
} from '../utils/choreParsers';
import {
  handleChoresQueryError,
  handleGetChoreError,
} from '../utils/choreErrorHandlers';
import {fetchChoreById} from '../utils/choreCrud';

// GET /api/chores - Get all chores
export const handleGetChores = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const {status, choreType, userId, page, limit} =
      parseChoresQueryRequest(req);
    const response = processChoresRequest({
      status,
      choreType,
      userId,
      page,
      limit,
    });
    return res.json(response);
  } catch (error) {
    return handleChoresQueryError(error, res);
  }
};

// GET /api/chores/:id - Get a specific chore
export const handleGetChoreById = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const {choreId} = parseGetChoreRequest(req);
    validateGetChoreInput(choreId);
    const validatedChore = fetchChoreById(choreId);
    return res.json({success: true, data: validatedChore});
  } catch (error) {
    return handleGetChoreError(error, res);
  }
};
