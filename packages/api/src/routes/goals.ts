import express from 'express';
import {
  CreateGoalSchema,
  UpdateGoalSchema,
  GoalQuerySchema,
  GoalSchema,
  CountRowSchema,
  asError,
  IdParamSchema,
} from '@gitterdun/shared';
import {z} from 'zod';
import db from '../lib/db';
import {logger} from '../utils/logger';
import {sql} from '../utils/sql';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

// GET /api/goals - Get all goals for a user
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const validatedQuery = GoalQuerySchema.parse(req.query);
    const {user_id: userId, status, page, limit} = validatedQuery;

    if (userId === undefined) {
      return res
        .status(400)
        .json({success: false, error: 'User ID is required'});
    }

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

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    // Get total count for pagination
    const countQuery = query.replace(
      /SELECT[\s\S]*?FROM/,
      'SELECT COUNT(*) as total FROM',
    );
    const totalRow = db.prepare(countQuery).get(...params);
    const {count: total} = CountRowSchema.parse(totalRow);

    // Add pagination and ordering
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const goals = db.prepare(query).all(...params);
    const validatedGoals = goals.map(goal => GoalSchema.parse(goal));

    return res.json({
      success: true,
      data: validatedGoals,
      pagination: {page, limit, total, totalPages: Math.ceil(total / limit)},
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({error}, 'Goals query validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid query parameters',
          details: error.stack,
        });
    }

    logger.error({error: asError(error)}, 'Get goals error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// POST /api/goals - Create a new goal
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const validatedBody = CreateGoalSchema.parse(req.body);
    const {title, description, target_points: targetPoints} = validatedBody;

    if (targetPoints <= 0) {
      return res
        .status(400)
        .json({success: false, error: 'Target points must be greater than 0'});
    }

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

    const validatedGoal = GoalSchema.parse(result);

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
    if (error instanceof z.ZodError) {
      logger.warn({error}, 'Create goal validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid request data',
          details: error.stack,
        });
    }

    logger.error({error: asError(error)}, 'Create goal error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// GET /api/goals/:id - Get a specific goal
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.get('/:id', async (req, res) => {
  try {
    const {id} = IdParamSchema.parse(req.params);
    const goalId = id;

    if (Number.isNaN(goalId)) {
      return res.status(400).json({success: false, error: 'Invalid goal ID'});
    }

    const goal = db
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

    if (goal === undefined) {
      return res.status(404).json({success: false, error: 'Goal not found'});
    }

    const validatedGoal = GoalSchema.parse(goal);

    return res.json({success: true, data: validatedGoal});
  } catch (error) {
    logger.error({error: asError(error)}, 'Get goal error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// PUT /api/goals/:id - Update a goal
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.put('/:id', async (req, res) => {
  try {
    const {id} = IdParamSchema.parse(req.params);
    const goalId = id;
    const validatedBody = UpdateGoalSchema.parse(req.body);

    if (Number.isNaN(goalId)) {
      return res.status(400).json({success: false, error: 'Invalid goal ID'});
    }

    // Check if goal exists
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

    if (existingGoal === undefined) {
      return res.status(404).json({success: false, error: 'Goal not found'});
    }

    // Build update query dynamically
    const updateFields: Array<string> = [];
    const values: Array<string | number> = [];

    if (validatedBody.title !== undefined) {
      updateFields.push('title = ?');
      values.push(validatedBody.title);
    }

    if (validatedBody.description !== undefined) {
      updateFields.push('description = ?');
      values.push(validatedBody.description);
    }

    if (validatedBody.target_points !== undefined) {
      updateFields.push('target_points = ?');
      values.push(validatedBody.target_points);
    }

    if (validatedBody.current_points !== undefined) {
      updateFields.push('current_points = ?');
      values.push(validatedBody.current_points);
    }

    if (validatedBody.status !== undefined) {
      updateFields.push('status = ?');
      values.push(validatedBody.status);
    }

    if (updateFields.length === 0) {
      return res
        .status(400)
        .json({success: false, error: 'No fields to update'});
    }

    // Add updated_at and id to values
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(goalId);

    const updateQuery = sql`
      UPDATE goals
      SET
        ${updateFields.join(', ')}
      WHERE
        id = ? RETURNING *
    `;

    const updatedGoal = db.prepare(updateQuery).get(...values);
    const validatedGoal = GoalSchema.parse(updatedGoal);

    logger.info({goalId}, 'Goal updated');

    return res.json({
      success: true,
      data: validatedGoal,
      message: 'Goal updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({error}, 'Update goal validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid request data',
          details: error.stack,
        });
    }

    logger.error({error: asError(error)}, 'Update goal error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// DELETE /api/goals/:id - Delete a goal
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.delete('/:id', async (req, res) => {
  try {
    const {id} = IdParamSchema.parse(req.params);
    const goalId = id;

    if (Number.isNaN(goalId)) {
      return res.status(400).json({success: false, error: 'Invalid goal ID'});
    }

    // Check if goal exists
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

    if (existingGoal === undefined) {
      return res.status(404).json({success: false, error: 'Goal not found'});
    }

    // Delete the goal
    db.prepare(sql`
      DELETE FROM goals
      WHERE
        id = ?
    `).run(goalId);

    logger.info({goalId}, 'Goal deleted');

    return res.json({success: true, message: 'Goal deleted successfully'});
  } catch (error) {
    logger.error({error: asError(error)}, 'Delete goal error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

export default router;
