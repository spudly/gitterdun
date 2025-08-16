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
import {sql} from '../utils/sql';

const router = express.Router();

// GET /api/chores - Get all chores
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support

const getBaseChoresQuery = () => {
  return sql`
    SELECT
      c.id,
      c.title,
      c.description,
      c.point_reward,
      c.bonus_points,
      c.penalty_points,
      c.due_date,
      c.recurrence_rule,
      c.chore_type,
      c.status,
      c.created_by,
      c.created_at,
      c.updated_at,
      u.username AS created_by_username
    FROM
      chores c
      LEFT JOIN users u ON c.created_by = u.id
    WHERE
      1 = 1
  `;
};

const applyChoreFilters = (
  baseQuery: string,
  status?: string,
  choreType?: string,
  userId?: number,
) => {
  let query = baseQuery;
  const params: Array<string | number> = [];

  if (typeof status === 'string' && status.length > 0) {
    query += ' AND c.status = ?';
    params.push(status);
  }

  if (typeof choreType === 'string' && choreType.length > 0) {
    query += ' AND c.chore_type = ?';
    params.push(choreType);
  }

  if (typeof userId === 'number') {
    query +=
      ' AND c.id IN (SELECT chore_id FROM chore_assignments WHERE user_id = ?)';
    params.push(userId);
  }

  return {query, params};
};

// Helper function to build chores query with filters
const buildChoresQuery = (
  status?: string,
  choreType?: string,
  userId?: number,
) => {
  const baseQuery = getBaseChoresQuery();
  return applyChoreFilters(baseQuery, status, choreType, userId);
};

// Helper function to get total count for pagination
const getChoresCount = (query: string, params: Array<string | number>) => {
  const countQuery = query.replace(
    /SELECT[\s\S]*?FROM/u,
    'SELECT COUNT(*) as total FROM',
  );
  const totalRow = db.prepare(countQuery).get(...params);
  const {count: total} = CountRowSchema.parse(totalRow);
  return total;
};

const buildPaginatedChoresQuery = (
  baseQuery: string,
  params: Array<string | number>,
  page: number,
  limit: number,
) => {
  const finalQuery = `${baseQuery} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
  const offset = (page - 1) * limit;
  const finalParams = [...params, limit, offset];
  return {finalQuery, finalParams};
};

const executeChoresQuery = (query: string, params: Array<string | number>) => {
  const chores = db.prepare(query).all(...params);
  return chores.map(chore => ChoreWithUsernameSchema.parse(chore));
};

const formatChoresResponse = (
  chores: Array<any>,
  page: number,
  limit: number,
  total: number,
) => {
  return {
    success: true,
    data: chores,
    pagination: {page, limit, total, totalPages: Math.ceil(total / limit)},
  };
};

const parseChoresQueryRequest = (req: any) => {
  const validatedQuery = ChoreQuerySchema.parse(req.query);
  const {
    status,
    chore_type: choreType,
    user_id: userId,
    page,
    limit,
  } = validatedQuery;
  return {status, choreType, userId, page, limit};
};

const processChoresRequest = (
  status?: string,
  choreType?: string,
  userId?: number,
  page?: number,
  limit?: number,
) => {
  const {query, params} = buildChoresQuery(status, choreType, userId);
  const total = getChoresCount(query, params);
  const {finalQuery, finalParams} = buildPaginatedChoresQuery(
    query,
    params,
    page!,
    limit!,
  );
  const validatedChores = executeChoresQuery(finalQuery, finalParams);
  return formatChoresResponse(validatedChores, page!, limit!, total);
};

const handleChoresQueryError = (error: unknown, res: any) => {
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
  return res.status(500).json({success: false, error: 'Internal server error'});
};

router.get('/', async (req, res) => {
  try {
    const {status, choreType, userId, page, limit} =
      parseChoresQueryRequest(req);
    const response = processChoresRequest(
      status,
      choreType,
      userId,
      page,
      limit,
    );
    return res.json(response);
  } catch (error) {
    return handleChoresQueryError(error, res);
  }
});

// POST /api/chores - Create a new chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
// Helper function to create chore in database
const createChoreInDb = (
  title: string,
  description: string,
  pointReward: number,
  bonusPoints: number,
  penaltyPoints: number,
  dueDate: string | null,
  recurrenceRule: string | null,
  choreType: string,
  createdBy: number,
) => {
  const createdRow = db
    .prepare(sql`
      INSERT INTO
        chores (
          title,
          description,
          point_reward,
          bonus_points,
          penalty_points,
          due_date,
          recurrence_rule,
          chore_type,
          created_by
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *
    `)
    .get(
      title,
      description,
      pointReward,
      bonusPoints,
      penaltyPoints,
      dueDate,
      recurrenceRule,
      choreType,
      createdBy,
    );

  return ChoreSchema.parse(createdRow);
};

// Helper function to assign chore to users
const assignChoreToUsers = (choreId: number, assignedUsers: Array<number>) => {
  if (assignedUsers.length > 0) {
    assignedUsers.forEach(userId => {
      db.prepare(sql`
        INSERT INTO
          chore_assignments (chore_id, user_id)
        VALUES
          (?, ?)
      `).run(choreId, userId);
    });
  }
};

router.post('/', async (req, res) => {
  try {
    // Validate and extract request data
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

    // Create chore with transaction
    const newChore = db.transaction(() => {
      const chore = createChoreInDb(
        title,
        description,
        pointReward,
        bonusPoints,
        penaltyPoints,
        dueDate,
        recurrenceRule,
        choreType,
        1,
      );
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

const parseGetChoreRequest = (req: any) => {
  const {id: choreId} = IdParamSchema.parse(req.params);
  return {choreId};
};

const validateGetChoreInput = (choreId: number) => {
  if (Number.isNaN(choreId)) {
    throw new Error('Invalid chore ID');
  }
};

const fetchChoreById = (choreId: number) => {
  const chore = db
    .prepare(sql`
      SELECT
        c.id,
        c.title,
        c.description,
        c.point_reward,
        c.bonus_points,
        c.penalty_points,
        c.due_date,
        c.recurrence_rule,
        c.chore_type,
        c.status,
        c.created_by,
        c.created_at,
        c.updated_at,
        u.username AS created_by_username
      FROM
        chores c
        LEFT JOIN users u ON c.created_by = u.id
      WHERE
        c.id = ?
    `)
    .get(choreId);

  if (chore === undefined) {
    throw new Error('Chore not found');
  }

  return ChoreSchema.parse(chore);
};

const handleGetChoreError = (error: unknown, res: any) => {
  if (error instanceof Error && error.message === 'Invalid chore ID') {
    return res.status(400).json({success: false, error: 'Invalid chore ID'});
  }

  if (error instanceof Error && error.message === 'Chore not found') {
    return res.status(404).json({success: false, error: 'Chore not found'});
  }

  logger.error({error: asError(error)}, 'Get chore error');
  return res.status(500).json({success: false, error: 'Internal server error'});
};

// GET /api/chores/:id - Get a specific chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.get('/:id', async (req, res) => {
  try {
    const {choreId} = parseGetChoreRequest(req);
    validateGetChoreInput(choreId);
    const validatedChore = fetchChoreById(choreId);

    return res.json({success: true, data: validatedChore});
  } catch (error) {
    return handleGetChoreError(error, res);
  }
});

const validateUpdateChoreInput = (choreId: number) => {
  if (Number.isNaN(choreId)) {
    throw new Error('Invalid chore ID');
  }
};

const checkChoreExists = (choreId: number) => {
  const existingChore = db
    .prepare(sql`
      SELECT
        id
      FROM
        chores
      WHERE
        id = ?
    `)
    .get(choreId);

  if (existingChore === undefined) {
    throw new Error('Chore not found');
  }
  return existingChore;
};

const CHORE_UPDATE_FIELD_MAPPINGS = [
  {field: 'title', column: 'title'},
  {field: 'description', column: 'description'},
  {field: 'point_reward', column: 'point_reward'},
  {field: 'bonus_points', column: 'bonus_points'},
  {field: 'penalty_points', column: 'penalty_points'},
  {field: 'due_date', column: 'due_date'},
  {field: 'recurrence_rule', column: 'recurrence_rule'},
  {field: 'chore_type', column: 'chore_type'},
  {field: 'status', column: 'status'},
];

const processChoreUpdateFields = (validatedBody: any) => {
  const updateFields: Array<string> = [];
  const values: Array<string | number> = [];

  for (const {field, column} of CHORE_UPDATE_FIELD_MAPPINGS) {
    if (validatedBody[field] !== undefined) {
      updateFields.push(`${column} = ?`);
      values.push(validatedBody[field]);
    }
  }

  if (updateFields.length === 0) {
    throw new Error('No fields to update');
  }

  return {updateFields, values};
};

const buildChoreUpdateQuery = (validatedBody: any, choreId: number) => {
  const {updateFields, values} = processChoreUpdateFields(validatedBody);

  // Add updated_at and id to values
  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(choreId);

  return {updateFields, values};
};

const executeChoreUpdate = (
  updateFields: Array<string>,
  values: Array<string | number>,
) => {
  const updateQuery = sql`
    UPDATE chores
    SET
      ${updateFields.join(', ')}
    WHERE
      id = ? RETURNING *
  `;
  const updatedChore = db.prepare(updateQuery).get(...values);
  return ChoreSchema.parse(updatedChore);
};

const parseUpdateChoreRequest = (req: any) => {
  const {id} = IdParamSchema.parse(req.params);
  const validatedBody = UpdateChoreSchema.parse(req.body);
  return {choreId: id, validatedBody};
};

const processChoreUpdate = (choreId: number, validatedBody: any) => {
  validateUpdateChoreInput(choreId);
  checkChoreExists(choreId);

  const {updateFields, values} = buildChoreUpdateQuery(validatedBody, choreId);
  const validatedChore = executeChoreUpdate(updateFields, values);

  logger.info({choreId}, 'Chore updated');
  return validatedChore;
};

const handleUpdateChoreError = (error: unknown, res: any) => {
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
  return res.status(500).json({success: false, error: 'Internal server error'});
};

// PUT /api/chores/:id - Update a chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.put('/:id', async (req, res) => {
  try {
    const {choreId, validatedBody} = parseUpdateChoreRequest(req);
    const validatedChore = processChoreUpdate(choreId, validatedBody);

    return res.json({
      success: true,
      data: validatedChore,
      message: 'Chore updated successfully',
    });
  } catch (error) {
    return handleUpdateChoreError(error, res);
  }
});

const parseDeleteChoreRequest = (req: any) => {
  const {id} = IdParamSchema.parse(req.params);
  return {choreId: id};
};

const validateDeleteChoreInput = (choreId: number) => {
  if (Number.isNaN(choreId)) {
    throw new Error('Invalid chore ID');
  }
};

const processChoreDelete = (choreId: number) => {
  // Check if chore exists
  const existingChore = db
    .prepare(sql`
      SELECT
        id
      FROM
        chores
      WHERE
        id = ?
    `)
    .get(choreId);

  if (existingChore === undefined) {
    throw new Error('Chore not found');
  }

  // Delete the chore (chore_assignments will be deleted due to CASCADE)
  db.prepare(sql`
    DELETE FROM chores
    WHERE
      id = ?
  `).run(choreId);

  logger.info({choreId}, 'Chore deleted');
};

const handleDeleteChoreError = (error: unknown, res: any) => {
  if (error instanceof Error && error.message === 'Invalid chore ID') {
    return res.status(400).json({success: false, error: 'Invalid chore ID'});
  }

  if (error instanceof Error && error.message === 'Chore not found') {
    return res.status(404).json({success: false, error: 'Chore not found'});
  }

  logger.error({error: asError(error)}, 'Delete chore error');
  return res.status(500).json({success: false, error: 'Internal server error'});
};

// DELETE /api/chores/:id - Delete a chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.delete('/:id', async (req, res) => {
  try {
    const {choreId} = parseDeleteChoreRequest(req);
    validateDeleteChoreInput(choreId);
    processChoreDelete(choreId);

    return res.json({success: true, message: 'Chore deleted successfully'});
  } catch (error) {
    return handleDeleteChoreError(error, res);
  }
});

// POST /api/chores/:id/complete - Mark a chore as completed
const validateChoreCompletionInput = (choreId: number) => {
  if (Number.isNaN(choreId)) {
    throw new Error('Invalid chore ID');
  }
};

const findChoreAssignment = (choreId: number, userId: number) => {
  const assignmentRow = db
    .prepare(sql`
      SELECT
        id,
        chore_id,
        user_id,
        assigned_at,
        completed_at,
        approved_at,
        approved_by,
        points_earned,
        bonus_points_earned,
        penalty_points_earned,
        notes
      FROM
        chore_assignments
      WHERE
        chore_id = ?
        AND user_id = ?
    `)
    .get(choreId, userId);

  if (assignmentRow === undefined) {
    throw new Error('Chore assignment not found');
  }

  const assignment = ChoreAssignmentSchema.parse(assignmentRow);
  if (assignment.completed_at !== undefined) {
    throw new Error('Chore is already completed');
  }

  return assignment;
};

const getChoreForCompletion = (choreId: number) => {
  const choreRow = db
    .prepare(sql`
      SELECT
        id,
        title,
        description,
        point_reward,
        bonus_points,
        penalty_points,
        due_date,
        recurrence_rule,
        chore_type,
        status,
        created_by,
        created_at,
        updated_at
      FROM
        chores
      WHERE
        id = ?
    `)
    .get(choreId);

  if (choreRow === undefined) {
    throw new Error('Chore not found');
  }

  return ChoreSchema.parse(choreRow);
};

const calculateCompletionPoints = (chore: any) => {
  const pointsEarned = chore.point_reward;
  const bonusPointsEarned = 0; // TODO: Implement bonus logic
  const penaltyPointsEarned = 0; // TODO: Implement penalty logic
  return {pointsEarned, bonusPointsEarned, penaltyPointsEarned};
};

const updateChoreAssignmentCompletion = (
  choreId: number,
  userId: number,
  points: {
    pointsEarned: number;
    bonusPointsEarned: number;
    penaltyPointsEarned: number;
  },
  notes?: string,
) => {
  db.prepare(sql`
    UPDATE chore_assignments
    SET
      completed_at = CURRENT_TIMESTAMP,
      points_earned = ?,
      bonus_points_earned = ?,
      penalty_points_earned = ?,
      notes = ?
    WHERE
      chore_id = ?
      AND user_id = ?
  `).run(
    points.pointsEarned,
    points.bonusPointsEarned,
    points.penaltyPointsEarned,
    notes,
    choreId,
    userId,
  );
};

const updateUserPointsForChore = (userId: number, totalPoints: number) => {
  db.prepare(sql`
    UPDATE users
    SET
      points = points + ?
    WHERE
      id = ?
  `).run(totalPoints, userId);
};

const createChoreCompletionNotification = (
  userId: number,
  chore: any,
  choreId: number,
) => {
  db.prepare(sql`
    INSERT INTO
      notifications (user_id, title, message, type, related_id)
    VALUES
      (?, ?, ?, ?, ?)
  `).run(
    userId,
    'Chore Completed',
    `Your chore "${chore.title}" has been completed and is pending approval.`,
    'chore_completed',
    choreId,
  );
};

const parseChoreCompletionRequest = (req: any) => {
  const {id} = IdParamSchema.parse(req.params);
  const {userId, notes} = CompleteChoreBodySchema.parse(req.body);
  return {choreId: id, userId, notes};
};

const executeChoreCompletionTransaction = (
  choreId: number,
  userId: number,
  notes?: string,
) => {
  const transaction = db.transaction(() => {
    findChoreAssignment(choreId, userId);
    const chore = getChoreForCompletion(choreId);
    const points = calculateCompletionPoints(chore);

    updateChoreAssignmentCompletion(choreId, userId, points, notes);
    const totalPoints =
      points.pointsEarned
      + points.bonusPointsEarned
      - points.penaltyPointsEarned;
    updateUserPointsForChore(userId, totalPoints);
    createChoreCompletionNotification(userId, chore, choreId);

    return {chore, pointsEarned: points.pointsEarned};
  });

  return transaction();
};

const handleChoreCompletionError = (error: unknown, res: any) => {
  if (error instanceof Error && error.message.includes('not found')) {
    return res.status(404).json({success: false, error: error.message});
  }

  if (error instanceof Error && error.message.includes('already completed')) {
    return res.status(400).json({success: false, error: error.message});
  }

  logger.error({error: asError(error)}, 'Complete chore error');
  return res.status(500).json({success: false, error: 'Internal server error'});
};

// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.post('/:id/complete', async (req, res) => {
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
});

export default router;
