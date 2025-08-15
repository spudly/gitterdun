import express from 'express';
import {
  CreateChoreSchema,
  UpdateChoreSchema,
  ChoreQuerySchema,
  ChoreSchema,
  ChoreWithUsernameSchema,
  ChoreAssignmentSchema,
  asError,
  CountRowSchema,
  IdParamSchema,
  CompleteChoreBodySchema,
} from '@gitterdun/shared';
import {z} from 'zod';
import db from '../lib/db';
import {logger} from '../utils/logger';

const router = express.Router();

// GET /api/chores - Get all chores
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const validatedQuery = ChoreQuerySchema.parse(req.query);
    const {
      status,
      chore_type: choreType,
      user_id: userId,
      page,
      limit,
    } = validatedQuery;

    let query = `
      SELECT 
        c.id, c.title, c.description, c.point_reward, c.bonus_points, c.penalty_points,
        c.due_date, c.recurrence_rule, c.chore_type, c.status, c.created_by, c.created_at, c.updated_at,
        u.username as created_by_username 
      FROM chores c 
      LEFT JOIN users u ON c.created_by = u.id
      WHERE 1=1
    `;
    const params: Array<string | number> = [];

    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }

    if (choreType) {
      query += ' AND c.chore_type = ?';
      params.push(choreType);
    }

    if (userId != null) {
      query +=
        ' AND c.id IN (SELECT chore_id FROM chore_assignments WHERE user_id = ?)';
      params.push(userId);
    }

    // Get total count for pagination
    const countQuery = query.replace(
      /SELECT[\s\S]*?FROM/,
      'SELECT COUNT(*) as total FROM',
    );
    const totalRow = db.prepare(countQuery).get(...params);
    const {count: total} = CountRowSchema.parse(totalRow);

    // Add pagination and ordering
    query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const chores = db.prepare(query).all(...params);
    const validatedChores = chores.map(chore =>
      ChoreWithUsernameSchema.parse(chore),
    );

    return res.json({
      success: true,
      data: validatedChores,
      pagination: {page, limit, total, totalPages: Math.ceil(total / limit)},
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({error}, 'Chores query validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid query parameters',
          details: error.stack,
        });
    }

    logger.error({error: asError(error)}, 'Get chores error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// POST /api/chores - Create a new chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const validatedBody = CreateChoreSchema.parse(req.body);
    const {
      title,
      description,
      point_reward: pointReward,
      bonus_points: bonusPoints = 0,
      penalty_points: penaltyPoints = 0,
      due_date: dueDate,
      recurrence_rule: recurrenceRule,
      chore_type: choreType,
      assigned_users: assignedUsers = [],
    } = validatedBody;

    // Start transaction
    const transaction = db.transaction(() => {
      // Create the chore
      const createdRow = db
        .prepare(
          `
        INSERT INTO chores (title, description, point_reward, bonus_points, penalty_points, due_date, recurrence_rule, chore_type, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
        RETURNING *
      `,
        )
        .get(
          title,
          description,
          pointReward,
          bonusPoints,
          penaltyPoints,
          dueDate,
          recurrenceRule,
          choreType,
          1,
        ); // TODO: Get actual user ID from auth

      const newChore = ChoreSchema.parse(createdRow);

      // Assign to users if specified
      if (assignedUsers.length > 0) {
        assignedUsers.forEach(userId => {
          db.prepare(
            'INSERT INTO chore_assignments (chore_id, user_id) VALUES (?, ?)',
          ).run(newChore.id, userId);
        });
      }

      return newChore;
    });

    const newChore = transaction();

    logger.info({choreId: newChore.id, title}, 'New chore created');

    return res
      .status(201)
      .json({
        success: true,
        data: newChore,
        message: 'Chore created successfully',
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({error}, 'Create chore validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid request data',
          details: error.stack,
        });
    }

    logger.error({error: asError(error)}, 'Create chore error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// GET /api/chores/:id - Get a specific chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.get('/:id', async (req, res) => {
  try {
    const {id: choreId} = IdParamSchema.parse(req.params);

    if (Number.isNaN(choreId)) {
      return res.status(400).json({success: false, error: 'Invalid chore ID'});
    }

    const chore = db
      .prepare(
        `
      SELECT 
        c.id, c.title, c.description, c.point_reward, c.bonus_points, c.penalty_points,
        c.due_date, c.recurrence_rule, c.chore_type, c.status, c.created_by, c.created_at, c.updated_at,
        u.username as created_by_username 
      FROM chores c 
      LEFT JOIN users u ON c.created_by = u.id 
      WHERE c.id = ?
    `,
      )
      .get(choreId);

    if (chore == null) {
      return res.status(404).json({success: false, error: 'Chore not found'});
    }

    const validatedChore = ChoreSchema.parse(chore);

    return res.json({success: true, data: validatedChore});
  } catch (error) {
    logger.error({error: asError(error)}, 'Get chore error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// PUT /api/chores/:id - Update a chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.put('/:id', async (req, res) => {
  try {
    const {id} = IdParamSchema.parse(req.params);
    const choreId = id;
    const validatedBody = UpdateChoreSchema.parse(req.body);

    if (Number.isNaN(choreId)) {
      return res.status(400).json({success: false, error: 'Invalid chore ID'});
    }

    // Check if chore exists
    const existingChore = db
      .prepare('SELECT id FROM chores WHERE id = ?')
      .get(choreId);

    if (existingChore == null) {
      return res.status(404).json({success: false, error: 'Chore not found'});
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

    if (validatedBody.point_reward !== undefined) {
      updateFields.push('point_reward = ?');
      values.push(validatedBody.point_reward);
    }

    if (validatedBody.bonus_points !== undefined) {
      updateFields.push('bonus_points = ?');
      values.push(validatedBody.bonus_points);
    }

    if (validatedBody.penalty_points !== undefined) {
      updateFields.push('penalty_points = ?');
      values.push(validatedBody.penalty_points);
    }

    if (validatedBody.due_date !== undefined) {
      updateFields.push('due_date = ?');
      values.push(validatedBody.due_date);
    }

    if (validatedBody.recurrence_rule !== undefined) {
      updateFields.push('recurrence_rule = ?');
      values.push(validatedBody.recurrence_rule);
    }

    if (validatedBody.chore_type !== undefined) {
      updateFields.push('chore_type = ?');
      values.push(validatedBody.chore_type);
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
    values.push(choreId);

    const updateQuery = `
      UPDATE chores 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
      RETURNING *
    `;

    const updatedChore = db.prepare(updateQuery).get(...values);
    const validatedChore = ChoreSchema.parse(updatedChore);

    logger.info({choreId}, 'Chore updated');

    return res.json({
      success: true,
      data: validatedChore,
      message: 'Chore updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({error}, 'Update chore validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid request data',
          details: error.stack,
        });
    }

    logger.error({error: asError(error)}, 'Update chore error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// DELETE /api/chores/:id - Delete a chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.delete('/:id', async (req, res) => {
  try {
    const {id} = IdParamSchema.parse(req.params);
    const choreId = id;

    if (Number.isNaN(choreId)) {
      return res.status(400).json({success: false, error: 'Invalid chore ID'});
    }

    // Check if chore exists
    const existingChore = db
      .prepare('SELECT id FROM chores WHERE id = ?')
      .get(choreId);

    if (existingChore == null) {
      return res.status(404).json({success: false, error: 'Chore not found'});
    }

    // Delete the chore (chore_assignments will be deleted due to CASCADE)
    db.prepare('DELETE FROM chores WHERE id = ?').run(choreId);

    logger.info({choreId}, 'Chore deleted');

    return res.json({success: true, message: 'Chore deleted successfully'});
  } catch (error) {
    logger.error({error: asError(error)}, 'Delete chore error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// POST /api/chores/:id/complete - Mark a chore as completed
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.post('/:id/complete', async (req, res) => {
  try {
    const {id} = IdParamSchema.parse(req.params);
    const choreId = id;
    const {userId, notes} = CompleteChoreBodySchema.parse(req.body);

    if (Number.isNaN(choreId)) {
      return res.status(400).json({success: false, error: 'Invalid chore ID'});
    }

    // userId is validated via schema

    // Start transaction
    const transaction = db.transaction(() => {
      // Check if chore assignment exists
      const assignmentRow = db
        .prepare(
          `SELECT id, chore_id, user_id, assigned_at, completed_at, approved_at, approved_by,
                  points_earned, bonus_points_earned, penalty_points_earned, notes
           FROM chore_assignments WHERE chore_id = ? AND user_id = ?`,
        )
        .get(choreId, userId);

      if (assignmentRow == null) {
        throw new Error('Chore assignment not found');
      }

      const assignment = ChoreAssignmentSchema.parse(assignmentRow);

      if (assignment.completed_at != null) {
        throw new Error('Chore is already completed');
      }

      // Get chore details for points calculation
      const choreRow = db
        .prepare(
          `SELECT id, title, description, point_reward, bonus_points, penalty_points,
                         due_date, recurrence_rule, chore_type, status, created_by, created_at, updated_at
                  FROM chores WHERE id = ?`,
        )
        .get(choreId);

      if (choreRow == null) {
        throw new Error('Chore not found');
      }

      const chore = ChoreSchema.parse(choreRow);

      // Calculate points (basic reward for now, bonus/penalty can be added later)
      const pointsEarned = chore.point_reward;
      const bonusPointsEarned = 0; // TODO: Implement bonus logic
      const penaltyPointsEarned = 0; // TODO: Implement penalty logic

      // Update chore assignment
      db.prepare(
        `
        UPDATE chore_assignments 
        SET completed_at = CURRENT_TIMESTAMP, 
            points_earned = ?, 
            bonus_points_earned = ?, 
            penalty_points_earned = ?,
            notes = ?
        WHERE chore_id = ? AND user_id = ?
      `,
      ).run(
        pointsEarned,
        bonusPointsEarned,
        penaltyPointsEarned,
        notes,
        choreId,
        userId,
      );

      // Update user points
      db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(
        pointsEarned + bonusPointsEarned - penaltyPointsEarned,
        userId,
      );

      // Create notification for admin approval
      db.prepare(
        `
        INSERT INTO notifications (user_id, title, message, type, related_id) 
        VALUES (?, ?, ?, ?, ?)
      `,
      ).run(
        userId,
        'Chore Completed',
        `Your chore "${chore.title}" has been completed and is pending approval.`,
        'chore_completed',
        choreId,
      );

      return {chore, pointsEarned};
    });

    const result = transaction();

    logger.info(
      {choreId, userId, pointsEarned: result.pointsEarned},
      'Chore marked as completed',
    );

    return res.json({
      success: true,
      message: 'Chore marked as completed successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({success: false, error: error.message});
    }

    if (error instanceof Error && error.message.includes('already completed')) {
      return res.status(400).json({success: false, error: error.message});
    }

    logger.error({error: asError(error)}, 'Complete chore error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

export default router;
