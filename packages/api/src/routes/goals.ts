import express from 'express';
import {IdParamSchema, GoalSchema} from '@gitterdun/shared';
import {logger} from '../utils/logger';

import {
  validateGoalsQuery,
  buildGoalsQuery,
  getTotalGoalsCount,
  addPaginationToQuery,
  fetchAndValidateGoals,
} from '../utils/goalQueries';
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
} from '../utils/goalOperations';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

// GET /api/goals - Get all goals for a user
router.get('/', async (req, res) => {
  const {userId, status, page, limit} = validateGoalsQuery(req.query);
  const {query: baseQuery, params: baseParams} = buildGoalsQuery(
    userId,
    status,
  );
  const total = getTotalGoalsCount(baseQuery, baseParams);
  const {query: paginatedQuery, params: finalParams} = addPaginationToQuery(
    baseQuery,
    baseParams,
    {page, limit},
  );
  const validatedGoals = fetchAndValidateGoals(paginatedQuery, finalParams);

  res.json({
    success: true,
    data: validatedGoals,
    pagination: {page, limit, total, totalPages: Math.ceil(total / limit)},
  });
});

// POST /api/goals - Create a new goal
router.post('/', async (req, res) => {
  const {title, description, targetPoints} = validateCreateGoalData(req.body);
  const validatedGoal = createGoalInDatabase(title, description, targetPoints);

  logger.info(
    {goalId: validatedGoal.id, title, targetPoints},
    'New goal created',
  );

  res
    .status(201)
    .json({
      success: true,
      data: validatedGoal,
      message: 'Goal created successfully',
    });
});

// GET /api/goals/:id - Get a specific goal
router.get('/:id', async (req, res) => {
  const {id} = IdParamSchema.parse(req.params);
  validateGoalId(id);

  const goal = fetchGoalById(id);
  if (goal === undefined) {
    res.status(404).json({success: false, error: 'Goal not found'});
    return;
  }

  const validatedGoal = GoalSchema.parse(goal);
  res.json({success: true, data: validatedGoal});
});

// PUT /api/goals/:id - Update a goal
router.put('/:id', async (req, res) => {
  const {goalId, updateData} = validateUpdateGoalRequest(req);

  if (!checkGoalExists(goalId)) {
    res.status(404).json({success: false, error: 'Goal not found'});
    return;
  }

  const builder = buildGoalUpdateQuery(updateData);
  const validatedGoal = executeGoalUpdate(goalId, builder);

  logger.info({goalId}, 'Goal updated');

  res.json({
    success: true,
    data: validatedGoal,
    message: 'Goal updated successfully',
  });
});

// DELETE /api/goals/:id - Delete a goal
router.delete('/:id', async (req, res) => {
  const {id} = IdParamSchema.parse(req.params);
  validateGoalId(id);

  if (!checkGoalExists(id)) {
    res.status(404).json({success: false, error: 'Goal not found'});
    return;
  }

  deleteGoalFromDatabase(id);
  logger.info({goalId: id}, 'Goal deleted');

  res.json({success: true, message: 'Goal deleted successfully'});
});

export default router;
