import express from 'express';
import type {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  TypedResponse,
} from '../types/http.js';
import {StatusCodes} from 'http-status-codes';
import {IdParamSchema, OutgoingGoalSchema} from '@gitterdun/shared';
import {logger} from '../utils/logger.js';

import {
  validateGoalsQuery,
  buildGoalsQuery,
  getTotalGoalsCount,
  addPaginationToQuery,
  fetchAndValidateGoals,
} from '../utils/goalQueries.js';
import {
  validateCreateGoalData,
  createGoalInDatabase,
  validateGoalId,
  fetchGoalById,
  checkGoalExists,
  validateUpdateGoalRequest,
  buildGoalUpdateQuery,
  executeGoalUpdate,
  deleteGoalFromDatabase,
} from '../utils/goalOperations.js';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

// GET /api/goals - Get all goals for a user
router.get(
  '/',
  async (
    req: RequestWithParams<Record<string, string>>,
    res: TypedResponse,
  ) => {
    const {userId, status, page, limit} = validateGoalsQuery(req.query);
    const {query: baseQuery, params: baseParams} = buildGoalsQuery(
      userId,
      status,
    );
    const total = await getTotalGoalsCount(baseQuery, baseParams);
    const {query: paginatedQuery, params: finalParams} = addPaginationToQuery(
      baseQuery,
      baseParams,
      {page, limit},
    );
    const validatedGoals = await fetchAndValidateGoals(
      paginatedQuery,
      finalParams,
    );

    const outgoingGoals = validatedGoals.map(goal =>
      OutgoingGoalSchema.parse(goal),
    );

    res.json({
      success: true,
      data: outgoingGoals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  },
);

// POST /api/goals - Create a new goal
router.post('/', async (req: RequestWithBody<unknown>, res: TypedResponse) => {
  const {title, description, targetPoints} = validateCreateGoalData(req.body);
  const validatedGoal = await createGoalInDatabase(
    title,
    description,
    targetPoints,
  );

  logger.info(
    {goalId: validatedGoal.id, title, targetPoints},
    'New goal created',
  );

  const outgoingGoal = OutgoingGoalSchema.parse(validatedGoal);
  res
    .status(StatusCodes.CREATED)
    .json({
      success: true,
      data: outgoingGoal,
      message: 'Goal created successfully',
    });
});

// GET /api/goals/:id - Get a specific goal
router.get(
  '/:id',
  async (req: RequestWithParams<{id: string}>, res: TypedResponse) => {
    const {id} = IdParamSchema.parse(req.params);
    validateGoalId(id);

    const goal = await fetchGoalById(id);
    if (goal === undefined) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({success: false, error: 'Goal not found'});
      return;
    }

    const outgoingGoal = OutgoingGoalSchema.parse(goal);
    res.json({success: true, data: outgoingGoal});
  },
);

// PUT /api/goals/:id - Update a goal
router.put(
  '/:id',
  async (
    req: RequestWithParamsAndBody<{id: string}, unknown>,
    res: TypedResponse,
  ) => {
    const {goalId, updateData} = validateUpdateGoalRequest(req);

    if (!(await checkGoalExists(goalId))) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({success: false, error: 'Goal not found'});
      return;
    }

    const builder = buildGoalUpdateQuery(updateData);
    const validatedGoal = await executeGoalUpdate(goalId, builder);

    logger.info({goalId}, 'Goal updated');

    const outgoingGoal = OutgoingGoalSchema.parse(validatedGoal);
    res.json({
      success: true,
      data: outgoingGoal,
      message: 'Goal updated successfully',
    });
  },
);

// DELETE /api/goals/:id - Delete a goal
router.delete(
  '/:id',
  async (
    req: RequestWithParamsAndBody<{id: string}, unknown>,
    res: TypedResponse,
  ) => {
    const {id} = IdParamSchema.parse(req.params);
    validateGoalId(id);

    if (!(await checkGoalExists(id))) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({success: false, error: 'Goal not found'});
      return;
    }

    await deleteGoalFromDatabase(id);
    logger.info({goalId: id}, 'Goal deleted');

    res.json({success: true, message: 'Goal deleted successfully'});
  },
);

export default router;
