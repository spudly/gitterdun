import express from 'express';
import {
  CreateGoalSchema,
  UpdateGoalSchema,
  GoalQuerySchema,
  GoalSchema,
  CountRowSchema,
  IdParamSchema,
} from '@gitterdun/shared';
import db from '../lib/db';
import {logger} from '../utils/logger';
import {sql} from '../utils/sql';
import {handleRouteError} from '../utils/errorHandling';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

type GoalsQueryParams = {
  userId: number;
  status?: string | undefined;
  page: number;
  limit: number;
};

type QueryWithParams = {query: string; params: Array<string | number>};

const validateGoalsQuery = (query: unknown): GoalsQueryParams => {
  const validatedQuery = GoalQuerySchema.parse(query);
  const {user_id: userId, status, page, limit} = validatedQuery;

  if (userId === undefined) {
    throw Object.assign(new Error('User ID is required'), {status: 400});
  }

  return {userId, status, page, limit};
};

const buildGoalsQuery = (userId: number, status?: string): QueryWithParams => {
  let query = sql`
    SELECT
      id,
      user_id,
      title,
      description,
      target_points,
      current_points,
      status,
      created_at,
      updated_at
    FROM
      goals
    WHERE
      user_id = ?
  `;
  const params: Array<string | number> = [userId];

  if (status !== undefined && status !== '') {
    query += ' AND status = ?';
    params.push(status);
  }

  return {query, params};
};

const getTotalGoalsCount = (
  baseQuery: string,
  params: Array<string | number>,
): number => {
  const countQuery = baseQuery.replace(
    /SELECT[\s\S]*?FROM/,
    'SELECT COUNT(*) as total FROM',
  );
  const totalRow = db.prepare(countQuery).get(...params);
  const {count: total} = CountRowSchema.parse(totalRow);
  return total;
};

type PaginationConfig = {page: number; limit: number};

const addPaginationToQuery = (
  baseQuery: string,
  params: Array<string | number>,
  pagination: PaginationConfig,
): QueryWithParams => {
  const {page, limit} = pagination;
  const query = `${baseQuery} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  const offset = (page - 1) * limit;
  const paginatedParams = [...params, limit, offset];
  return {query, params: paginatedParams};
};

const fetchAndValidateGoals = (
  query: string,
  params: Array<string | number>,
) => {
  const goals = db.prepare(query).all(...params);
  return goals.map(goal => GoalSchema.parse(goal));
};

const checkGoalExists = (goalId: number): boolean => {
  const existingGoal = db
    .prepare(sql`
      SELECT
        id
      FROM
        goals
      WHERE
        id = ?
    `)
    .get(goalId);
  return existingGoal !== undefined;
};

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

const validateCreateGoalData = (body: unknown) => {
  const validatedBody = CreateGoalSchema.parse(body);
  const {title, description, target_points: targetPoints} = validatedBody;

  if (targetPoints <= 0) {
    throw Object.assign(new Error('Target points must be greater than 0'), {
      status: 400,
    });
  }

  return {title, description, targetPoints};
};

const createGoalInDatabase = (
  title: string,
  description: string | undefined,
  targetPoints: number,
) => {
  const result = db
    .prepare(sql`
      INSERT INTO
        goals (
          title,
          description,
          target_points,
          current_points,
          user_id
        )
      VALUES
        (?, ?, ?, ?, ?) RETURNING *
    `)
    .get(title, description, targetPoints, 0, 1);

  return GoalSchema.parse(result);
};

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

const validateGoalId = (id: number): void => {
  if (Number.isNaN(id)) {
    throw Object.assign(new Error('Invalid goal ID'), {status: 400});
  }
};

const fetchGoalById = (goalId: number) => {
  return db
    .prepare(sql`
      SELECT
        id,
        user_id,
        title,
        description,
        target_points,
        current_points,
        status,
        created_at,
        updated_at
      FROM
        goals
      WHERE
        id = ?
    `)
    .get(goalId);
};

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

type UpdateGoalRequest = {
  goalId: number;
  updateData: {
    title?: string | undefined;
    description?: string | undefined;
    target_points?: number | undefined;
    current_points?: number | undefined;
    status?: string | undefined;
  };
};

type UpdateQueryBuilder = {
  updateFields: Array<string>;
  values: Array<string | number>;
};

const validateUpdateGoalRequest = (req: express.Request): UpdateGoalRequest => {
  const {id} = IdParamSchema.parse(req.params);
  const updateData = UpdateGoalSchema.parse(req.body);
  validateGoalId(id);
  return {goalId: id, updateData};
};

const addUpdateField = (
  builder: UpdateQueryBuilder,
  field: string,
  value: string | number | undefined,
): void => {
  if (value !== undefined) {
    builder.updateFields.push(`${field} = ?`);
    builder.values.push(value);
  }
};

const buildGoalUpdateQuery = (
  updateData: UpdateGoalRequest['updateData'],
): UpdateQueryBuilder => {
  const builder: UpdateQueryBuilder = {updateFields: [], values: []};

  addUpdateField(builder, 'title', updateData.title);
  addUpdateField(builder, 'description', updateData.description);
  addUpdateField(builder, 'target_points', updateData.target_points);
  addUpdateField(builder, 'current_points', updateData.current_points);
  addUpdateField(builder, 'status', updateData.status);

  if (builder.updateFields.length === 0) {
    throw Object.assign(new Error('No fields to update'), {status: 400});
  }

  builder.updateFields.push('updated_at = CURRENT_TIMESTAMP');
  return builder;
};

const executeGoalUpdate = (goalId: number, builder: UpdateQueryBuilder) => {
  const values = [...builder.values, goalId];
  const updateQuery = sql`
    UPDATE goals
    SET
      ${builder.updateFields.join(', ')}
    WHERE
      id = ? RETURNING *
  `;

  const updatedGoal = db.prepare(updateQuery).get(...values);
  return GoalSchema.parse(updatedGoal);
};

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

const deleteGoalFromDatabase = (goalId: number): void => {
  db.prepare(sql`
    DELETE FROM goals
    WHERE
      id = ?
  `).run(goalId);
};

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
