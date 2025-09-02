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
import {requireUserId} from '../utils/auth';
import {getUserFamily} from '../utils/familyOperations';

// GET /api/chores - Get all chores
export const handleGetChores = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const {status, choreType, userId, page, limit} =
      parseChoresQueryRequest(req);
    // Infer family_id from current user if available; fall back to parsed userId
    let effectiveFamilyId: number | undefined;
    try {
      const currentUserId = requireUserId(req);
      const family = getUserFamily(currentUserId);
      if (family != null) {
        effectiveFamilyId = family.id;
      }
    } catch {
      // unauthenticated or no family; leave undefined to avoid filtering
    }
    const response = processChoresRequest({
      status,
      choreType,
      userId: effectiveFamilyId ?? userId,
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
