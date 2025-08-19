import express from 'express';
import {CreateChoreSchema} from '@gitterdun/shared';
import db from '../lib/db';
import {logger} from '../utils/logger';
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
import {processChoreUpdate} from '../utils/choreUpdates';
import {executeChoreCompletionTransaction} from '../utils/choreCompletion';

// POST /api/chores - Create a new chore
export const handleCreateChore = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const {
      title,
      description = '',
      point_reward: pointReward,
      bonus_points: bonusPoints = 0,
      penalty_points: penaltyPoints = 0,
      due_date: dueDate = null,
      recurrence_rule: recurrenceRule = null,
      chore_type: choreType,
      assigned_users: assignedUsers = [],
    } = CreateChoreSchema.parse(req.body);

    const newChore = db.transaction(() => {
      const chore = createChoreInDb({
        title,
        description,
        pointReward,
        bonusPoints,
        penaltyPoints,
        dueDate,
        recurrenceRule,
        choreType,
        createdBy: 1,
      });
      assignChoreToUsers(chore.id, assignedUsers);
      return chore;
    })();

    logger.info({choreId: newChore.id, title}, 'New chore created');
    return res
      .status(201)
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
