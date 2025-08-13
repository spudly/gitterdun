import express from 'express';
import {
  CreateGoalSchema,
  UpdateGoalSchema,
  GoalQuerySchema,
  GoalSchema,
} from '@gitterdun/shared';
import {z} from 'zod';
import db from '../lib/db';
import {logger} from '../utils/logger';

const router = express.Router();

// GET /api/goals - Get all goals for a user
router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const validatedQuery = GoalQuerySchema.parse(req.query);
    const {user_id: userId, status, page, limit} = validatedQuery;

    if (!userId) {
      return res
        .status(400)
        .json({success: false, error: 'User ID is required'});
    }

    let query = 'SELECT * FROM goals WHERE user_id = ?';
    const params: any[] = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    // Get total count for pagination
    const countQuery = query.replace('*', 'COUNT(*) as total');
    const totalResult = db.prepare(countQuery).get(...params) as any;
    const {total} = totalResult;

    // Add pagination and ordering
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const goals = db.prepare(query).all(...params) as any[];
    const validatedGoals = goals.map(goal => GoalSchema.parse(goal));

    return res.json({
      success: true,
      data: validatedGoals,
      pagination: {page, limit, total, totalPages: Math.ceil(total / limit)},
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({errors: error.errors}, 'Goals query validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid query parameters',
          details: error.errors,
        });
    }

    logger.error({error: error as Error}, 'Get goals error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// POST /api/goals - Create a new goal
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
      .prepare(
        `
      INSERT INTO goals (title, description, target_points, current_points, user_id) 
      VALUES (?, ?, ?, ?, ?) 
      RETURNING *
    `,
      )
      .get(title, description, targetPoints, 0, 1) as any; // TODO: Get actual user ID from auth

    const validatedGoal = GoalSchema.parse(result);

    logger.info({goalId: result.id, title, targetPoints}, 'New goal created');

    return res
      .status(201)
      .json({
        success: true,
        data: validatedGoal,
        message: 'Goal created successfully',
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({errors: error.errors}, 'Create goal validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        });
    }

    logger.error({error: error as Error}, 'Create goal error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// GET /api/goals/:id - Get a specific goal
router.get('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const goalId = parseInt(id, 10);

    if (Number.isNaN(goalId)) {
      return res.status(400).json({success: false, error: 'Invalid goal ID'});
    }

    const goal = db
      .prepare('SELECT * FROM goals WHERE id = ?')
      .get(goalId) as any;

    if (!goal) {
      return res.status(404).json({success: false, error: 'Goal not found'});
    }

    const validatedGoal = GoalSchema.parse(goal);

    return res.json({success: true, data: validatedGoal});
  } catch (error) {
    logger.error({error: error as Error}, 'Get goal error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// PUT /api/goals/:id - Update a goal
router.put('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const goalId = parseInt(id, 10);
    const validatedBody = UpdateGoalSchema.parse(req.body);

    if (Number.isNaN(goalId)) {
      return res.status(400).json({success: false, error: 'Invalid goal ID'});
    }

    // Check if goal exists
    const existingGoal = db
      .prepare('SELECT id FROM goals WHERE id = ?')
      .get(goalId) as any;

    if (!existingGoal) {
      return res.status(404).json({success: false, error: 'Goal not found'});
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const values: any[] = [];

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

    const updateQuery = `
      UPDATE goals 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
      RETURNING *
    `;

    const updatedGoal = db.prepare(updateQuery).get(...values) as any;
    const validatedGoal = GoalSchema.parse(updatedGoal);

    logger.info({goalId}, 'Goal updated');

    return res.json({
      success: true,
      data: validatedGoal,
      message: 'Goal updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({errors: error.errors}, 'Update goal validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        });
    }

    logger.error({error: error as Error}, 'Update goal error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// DELETE /api/goals/:id - Delete a goal
router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const goalId = parseInt(id, 10);

    if (Number.isNaN(goalId)) {
      return res.status(400).json({success: false, error: 'Invalid goal ID'});
    }

    // Check if goal exists
    const existingGoal = db
      .prepare('SELECT id FROM goals WHERE id = ?')
      .get(goalId) as any;

    if (!existingGoal) {
      return res.status(404).json({success: false, error: 'Goal not found'});
    }

    // Delete the goal
    db.prepare('DELETE FROM goals WHERE id = ?').run(goalId);

    logger.info({goalId}, 'Goal deleted');

    return res.json({success: true, message: 'Goal deleted successfully'});
  } catch (error) {
    logger.error({error: error as Error}, 'Delete goal error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

export default router;
