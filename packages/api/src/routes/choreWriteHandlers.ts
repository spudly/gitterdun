import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {CreateChoreSchema} from '@gitterdun/shared';
import db from '../lib/db';
import {logger} from '../utils/logger';
import {requireUserId} from '../utils/auth';
import {getUserFamily} from '../utils/familyOperations';
import {validateParentMembership} from '../utils/familyAuthUtils';
import {
  parseUpdateChoreRequest,
  parseDeleteChoreRequest,
  parseChoreCompletionRequest,
  validateUpdateChoreInput,
  validateDeleteChoreInput,
  validateChoreCompletionInput,
} from '../utils/choreParsers';
import {
  handleUpdateChoreError,
  handleDeleteChoreError,
  handleChoreCompletionError,
  handleCreateChoreError,
} from '../utils/choreErrorHandlers';
import {
  createChoreInDb,
  assignChoreToUsers,
  processChoreDelete,
} from '../utils/choreCrud';
import {buildRRuleString} from '../utils/recurrence';
import {processChoreUpdate} from '../utils/choreUpdates';
import {executeChoreCompletionTransaction} from '../utils/choreCompletion';

// POST /api/chores - Create a new chore
export const handleCreateChore = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = requireUserId(req);
    const family = getUserFamily(userId);
    if (family === null) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({success: false, error: 'Forbidden'});
    }
    validateParentMembership(userId, family.id);

    const {
      title,
      description = '',
      reward_points: rewardPoints,
      penalty_points: penaltyPoints = 0,
      start_date: startDate = null,
      due_date: dueDate = null,
      recurrence,
      chore_type: choreType,
      assigned_users: assignedUsers = [],
    } = CreateChoreSchema.parse(req.body);

    let recurrenceRule: string | null = null;
    if (recurrence) {
      const rr = buildRRuleString(recurrence);
      recurrenceRule = rr.replace(/^RRULE:/i, '');
    }

    const newChore = db.transaction(() => {
      const chore = createChoreInDb({
        title,
        description,
        rewardPoints: rewardPoints ?? null,
        penaltyPoints,
        startDate,
        dueDate,
        recurrenceRule,
        choreType,
        createdBy: userId,
        familyId: family.id,
      });
      assignChoreToUsers(chore.id, assignedUsers);
      return chore;
    })();

    logger.info({choreId: newChore.id, title}, 'New chore created');
    return res
      .status(StatusCodes.CREATED)
      .json({
        success: true,
        data: newChore,
        message: 'Chore created successfully',
      });
  } catch (error) {
    return handleCreateChoreError(error, res);
  }
};

// PUT /api/chores/:id - Update a chore
export const handleUpdateChore = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = requireUserId(req);
    const family = getUserFamily(userId);
    if (family === null) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({success: false, error: 'Forbidden'});
    }
    validateParentMembership(userId, family.id);
    const {choreId, validatedBody} = parseUpdateChoreRequest(req);
    validateUpdateChoreInput(choreId);
    const validatedChore = processChoreUpdate(choreId, validatedBody);
    return res.json({
      success: true,
      data: validatedChore,
      message: 'Chore updated successfully',
    });
  } catch (error) {
    return handleUpdateChoreError(error, res);
  }
};

// DELETE /api/chores/:id - Delete a chore
export const handleDeleteChore = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = requireUserId(req);
    const family = getUserFamily(userId);
    if (family === null) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({success: false, error: 'Forbidden'});
    }
    validateParentMembership(userId, family.id);
    const {choreId} = parseDeleteChoreRequest(req);
    validateDeleteChoreInput(choreId);
    processChoreDelete(choreId);
    return res.json({success: true, message: 'Chore deleted successfully'});
  } catch (error) {
    return handleDeleteChoreError(error, res);
  }
};

// POST /api/chores/:id/complete - Mark a chore as completed
export const handleCompleteChore = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const {choreId, userId, notes} = parseChoreCompletionRequest(req);
    validateChoreCompletionInput(choreId);
    const result = executeChoreCompletionTransaction(choreId, userId, notes);
    logger.info(
      {choreId, userId, pointsEarned: result.pointsEarned},
      'Chore marked as completed',
    );
    return res.json({
      success: true,
      message: 'Chore marked as completed successfully',
    });
  } catch (error) {
    return handleChoreCompletionError(error, res);
  }
};

// assign/approve moved to choreModerationHandlers.ts
