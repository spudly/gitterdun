import express from 'express';
import {IdParamSchema, GoalSchema} from '@gitterdun/shared';
import {logger} from '../utils/logger';
import {handleRouteError} from '../utils/errorHandling';
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
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.get('/', async (req, res) => {
  try {
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

    return res.json({
      success: true,
      data: validatedGoals,
      pagination: {page, limit, total, totalPages: Math.ceil(total / limit)},
    });
  } catch (error) {
    return handleRouteError(res, error, 'Get goals');
  }
});

// POST /api/goals - Create a new goal
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.post('/', async (req, res) => {
  try {
    const {title, description, targetPoints} = validateCreateGoalData(req.body);
    const validatedGoal = createGoalInDatabase(
      title,
      description,
      targetPoints,
    );

    logger.info(
      {goalId: validatedGoal.id, title, targetPoints},
      'New goal created',
    );

    return res
      .status(201)
      .json({
        success: true,
        data: validatedGoal,
        message: 'Goal created successfully',
      });
  } catch (error) {
    return handleRouteError(res, error, 'Create goal');
  }
});

// GET /api/goals/:id - Get a specific goal
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.get('/:id', async (req, res) => {
  try {
    const {id} = IdParamSchema.parse(req.params);
    validateGoalId(id);

    const goal = fetchGoalById(id);
    if (goal === undefined) {
      return res.status(404).json({success: false, error: 'Goal not found'});
    }

    const validatedGoal = GoalSchema.parse(goal);
    return res.json({success: true, data: validatedGoal});
  } catch (error) {
    return handleRouteError(res, error, 'Get goal');
  }
});

// PUT /api/goals/:id - Update a goal
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.put('/:id', async (req, res) => {
  try {
    const {goalId, updateData} = validateUpdateGoalRequest(req);

    if (!checkGoalExists(goalId)) {
      return res.status(404).json({success: false, error: 'Goal not found'});
    }

    const builder = buildGoalUpdateQuery(updateData);
    const validatedGoal = executeGoalUpdate(goalId, builder);

    logger.info({goalId}, 'Goal updated');

    return res.json({
      success: true,
      data: validatedGoal,
      message: 'Goal updated successfully',
    });
  } catch (error) {
    return handleRouteError(res, error, 'Update goal');
  }
});

// DELETE /api/goals/:id - Delete a goal
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.delete('/:id', async (req, res) => {
  try {
    const {id} = IdParamSchema.parse(req.params);
    validateGoalId(id);

    if (!checkGoalExists(id)) {
      return res.status(404).json({success: false, error: 'Goal not found'});
    }

    deleteGoalFromDatabase(id);
    logger.info({goalId: id}, 'Goal deleted');

    return res.json({success: true, message: 'Goal deleted successfully'});
  } catch (error) {
    return handleRouteError(res, error, 'Delete goal');
  }
});

export default router;
