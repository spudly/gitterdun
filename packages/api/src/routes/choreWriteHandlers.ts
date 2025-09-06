import type {
  RequestWithParams,
  RequestWithBody,
  TypedResponse,
} from '../types/http.js';
import {StatusCodes} from 'http-status-codes';
import {CreateChoreSchema} from '@gitterdun/shared';
import {transaction} from '../utils/crud/db.js';
import {logger} from '../utils/logger.js';
import {requireUserId} from '../utils/auth.js';
import {getUserFamily} from '../utils/familyOperations.js';
import {validateParentMembership} from '../utils/familyAuthUtils.js';
import {
  parseUpdateChoreRequest,
  parseDeleteChoreRequest,
  parseChoreCompletionRequest,
  validateChoreCompletionInput,
} from '../utils/choreParsers.js';
import {
  handleUpdateChoreError,
  handleDeleteChoreError,
  handleChoreCompletionError,
  handleCreateChoreError,
} from '../utils/choreErrorHandlers.js';
import {
  createChoreInDb,
  assignChoreToUsers,
  processChoreDelete,
} from '../utils/choreCrud.js';
import {buildRRuleString} from '../utils/recurrence.js';
import {processChoreUpdate} from '../utils/choreUpdates.js';
import {executeChoreCompletionTransaction} from '../utils/choreCompletion.js';

// POST /api/chores - Create a new chore
export const handleCreateChore = async (
  req: RequestWithBody<unknown>,
  res: TypedResponse,
): Promise<void> => {
  try {
    const userId = await requireUserId(req);
    const family = await getUserFamily(userId);
    if (family === null) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({success: false, error: 'Forbidden'});
      return;
    }
    await validateParentMembership(userId, family.id);

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

    const newChore = await transaction(async () => {
      const chore = await createChoreInDb({
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
      await assignChoreToUsers(chore.id, assignedUsers);
      return chore;
    });

    logger.info({choreId: newChore.id, title}, 'New chore created');
    res
      .status(StatusCodes.CREATED)
      .json({
        success: true,
        data: newChore,
        message: 'Chore created successfully',
      });
  } catch (error) {
    handleCreateChoreError(error, res);
  }
};

// PUT /api/chores/:id - Update a chore
export const handleUpdateChore = async (
  req: RequestWithBody<unknown>,
  res: TypedResponse,
): Promise<void> => {
  try {
    const userId = await requireUserId(req);
    const family = await getUserFamily(userId);
    if (family === null) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({success: false, error: 'Forbidden'});
      return;
    }
    await validateParentMembership(userId, family.id);
    const {choreId, validatedBody} = parseUpdateChoreRequest(req);
    const validatedChore = await processChoreUpdate(choreId, validatedBody);
    res.json({
      success: true,
      data: validatedChore,
      message: 'Chore updated successfully',
    });
  } catch (error) {
    handleUpdateChoreError(error, res);
  }
};

// DELETE /api/chores/:id - Delete a chore
export const handleDeleteChore = async (
  req: RequestWithParams<{id: string}>,
  res: TypedResponse,
): Promise<void> => {
  try {
    const userId = await requireUserId(req);
    const family = await getUserFamily(userId);
    if (family === null) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({success: false, error: 'Forbidden'});
      return;
    }
    await validateParentMembership(userId, family.id);
    const {choreId} = parseDeleteChoreRequest(req);
    await processChoreDelete(choreId);
    res.json({success: true, message: 'Chore deleted successfully'});
  } catch (error) {
    handleDeleteChoreError(error, res);
  }
};

// POST /api/chores/:id/complete - Mark a chore as completed
export const handleCompleteChore = async (
  req: RequestWithBody<unknown>,
  res: TypedResponse,
): Promise<void> => {
  try {
    const {choreId, userId, notes} = parseChoreCompletionRequest(req);
    validateChoreCompletionInput(choreId);
    const result = await executeChoreCompletionTransaction(
      choreId,
      userId,
      notes,
    );
    logger.info(
      {choreId, userId, pointsEarned: result.pointsEarned},
      'Chore marked as completed',
    );
    res.json({
      success: true,
      message: 'Chore marked as completed successfully',
    });
  } catch (error) {
    handleChoreCompletionError(error, res);
  }
};

// assign/approve moved to choreModerationHandlers.ts
