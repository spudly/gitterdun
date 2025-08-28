import express from 'express';
import {StatusCodes} from 'http-status-codes';
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
import {
  assignChoreToSingleUser,
  approveChoreAssignment,
  rejectChoreAssignment,
} from '../utils/choreModeration';

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
      start_date: startDate = null,
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
        startDate,
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

// POST /api/chores/:id/assign - Assign a chore to a user
export const handleAssignChore = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const choreId = Number((req.params as Record<string, string>)['id']);
    const {userId} = req.body as {userId?: number};
    if (!Number.isInteger(choreId) || !Number.isInteger(userId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({success: false, error: 'Invalid chore or user id'});
    }
    assignChoreToSingleUser(choreId, userId!);
    return res.json({success: true});
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: (error as Error).message});
  }
};

// POST /api/chores/:id/approve - Approve a completed chore
export const handleApproveChore = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const choreId = Number((req.params as Record<string, string>)['id']);
    const {approvedBy} = req.body as {approvedBy?: number};
    if (!Number.isInteger(choreId) || !Number.isInteger(approvedBy)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({success: false, error: 'Invalid chore id or approver id'});
    }
    approveChoreAssignment(choreId, approvedBy!);
    return res.json({success: true});
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: (error as Error).message});
  }
};

// POST /api/chores/:id/reject - Reject a completed chore
export const handleRejectChore = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const choreId = Number((req.params as Record<string, string>)['id']);
    if (!Number.isInteger(choreId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({success: false, error: 'Invalid chore id'});
    }
    rejectChoreAssignment(choreId);
    return res.json({success: true});
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: (error as Error).message});
  }
};
