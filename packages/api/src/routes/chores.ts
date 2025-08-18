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

type UpdateChore = z.infer<typeof UpdateChoreSchema>;
type Chore = z.infer<typeof ChoreSchema>;
type ChoreWithUsername = z.infer<typeof ChoreWithUsernameSchema>;

type ChoreFilters = {
  status?: string | undefined;
  choreType?: string | undefined;
  userId?: number | undefined;
};

type PaginatedQueryParams = {
  baseQuery: string;
  params: Array<string | number>;
  page: number;
  limit: number;
};

type ChoresResponseParams = {
  chores: Array<ChoreWithUsername>;
  page: number;
  limit: number;
  total: number;
};

type ProcessChoresParams = {
  status?: string | undefined;
  choreType?: string | undefined;
  userId?: number | undefined;
  page?: number | undefined;
  limit?: number | undefined;
};

type ChoreCompletionParams = {
  choreId: number;
  userId: number;
  points: {
    pointsEarned: number;
    bonusPointsEarned: number;
    penaltyPointsEarned: number;
  };
  notes?: string | undefined;
};

type CreateChoreParams = {
  title: string;
  description: string;
  pointReward: number;
  bonusPoints: number;
  penaltyPoints: number;
  dueDate: string | null;
  recurrenceRule: string | null;
  choreType: string;
  createdBy: number;
};

// eslint-disable-next-line new-cap -- express.Router() is a factory function
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

type FilterResult = {queryAddition: string; param?: string | number};

const getStatusFilter = (status?: string): FilterResult => {
  return status != null
    ? {queryAddition: ' AND c.status = ?', param: status}
    : {queryAddition: ''};
};

const getChoreTypeFilter = (choreType?: string): FilterResult => {
  return choreType != null
    ? {queryAddition: ' AND c.chore_type = ?', param: choreType}
    : {queryAddition: ''};
};

const getUserIdFilter = (userId?: number): FilterResult => {
  return userId != null
    ? {
        queryAddition:
          ' AND c.id IN (SELECT chore_id FROM chore_assignments WHERE user_id = ?)',
        param: userId,
      }
    : {queryAddition: ''};
};

const applyChoreFilters = (
  baseQuery: string,
  {status, choreType, userId}: ChoreFilters,
) => {
  const statusFilter = getStatusFilter(status);
  const choreTypeFilter = getChoreTypeFilter(choreType);
  const userIdFilter = getUserIdFilter(userId);

  const query =
    baseQuery
    + statusFilter.queryAddition
    + choreTypeFilter.queryAddition
    + userIdFilter.queryAddition;
  const params = [
    statusFilter.param,
    choreTypeFilter.param,
    userIdFilter.param,
  ].filter(param => param !== undefined);

  return {query, params};
};

// Helper function to build chores query with filters
const buildChoresQuery = (
  status?: string,
  choreType?: string,
  userId?: number,
) => {
  const baseQuery = getBaseChoresQuery();
  return applyChoreFilters(baseQuery, {status, choreType, userId});
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

const buildPaginatedChoresQuery = (params: PaginatedQueryParams) => {
  const {baseQuery, params: queryParams, page, limit} = params;
  const finalQuery = `${baseQuery} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
  const offset = (page - 1) * limit;
  const finalParams = [...queryParams, limit, offset];
  return {finalQuery, finalParams};
};

const executeChoresQuery = (
  query: string,
  params: Array<string | number>,
): Array<ChoreWithUsername> => {
  const chores = db.prepare(query).all(...params);
  return chores.map(chore => ChoreWithUsernameSchema.parse(chore));
};

const formatChoresResponse = (params: ChoresResponseParams) => {
  const {chores, page, limit, total} = params;
  return {
    success: true as const,
    data: chores,
    pagination: {page, limit, total, totalPages: Math.ceil(total / limit)},
  };
};

const parseChoresQueryRequest = (req: express.Request) => {
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

const processChoresRequest = (params: ProcessChoresParams) => {
  const {status, choreType, userId, page, limit} = params;
  const {query, params: queryParams} = buildChoresQuery(
    status,
    choreType,
    userId,
  );
  const total = getChoresCount(query, queryParams);

  // Provide default values for pagination
  const safePage = page ?? 1;
  const safeLimit = limit ?? 10;

  const {finalQuery, finalParams} = buildPaginatedChoresQuery({
    baseQuery: query,
    params: queryParams,
    page: safePage,
    limit: safeLimit,
  });
  const validatedChores = executeChoresQuery(finalQuery, finalParams);
  return formatChoresResponse({
    chores: validatedChores,
    page: safePage,
    limit: safeLimit,
    total,
  });
};

const handleChoresQueryError = (error: unknown, res: express.Response) => {
  if (error instanceof z.ZodError) {
    logger.warn({error}, 'Chores query validation error');
    return res
      .status(400)
      .json({
        success: false as const,
        error: 'Invalid query parameters',
        details: error.stack,
      });
  }

  logger.error({error: asError(error)}, 'Get chores error');
  return res
    .status(500)
    .json({success: false as const, error: 'Internal server error'});
};

// eslint-disable-next-line @typescript-eslint/no-misused-promises -- properly handled with try-catch
router.get('/', async (req, res) => {
  try {
    const {status, choreType, userId, page, limit} =
      parseChoresQueryRequest(req);
    const response = processChoresRequest({
      status,
      choreType,
      userId,
      page,
      limit,
    });
    return res.json(response);
  } catch (error) {
    return handleChoresQueryError(error, res);
  }
});

// POST /api/chores - Create a new chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
// Helper function to create chore in database
const createChoreInDb = (params: CreateChoreParams) => {
  const {
    title,
    description,
    pointReward,
    bonusPoints,
    penaltyPoints,
    dueDate,
    recurrenceRule,
    choreType,
    createdBy,
  } = params;
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

// eslint-disable-next-line @typescript-eslint/no-misused-promises -- properly handled with try-catch
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
      const chore = createChoreInDb({
        title,
        description,
        pointReward,
        bonusPoints,
        penaltyPoints,
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

const parseGetChoreRequest = (req: express.Request) => {
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

const handleGetChoreError = (error: unknown, res: express.Response) => {
  if (error instanceof Error && error.message === 'Invalid chore ID') {
    return res
      .status(400)
      .json({success: false as const, error: 'Invalid chore ID'});
  }

  if (error instanceof Error && error.message === 'Chore not found') {
    return res
      .status(404)
      .json({success: false as const, error: 'Chore not found'});
  }

  logger.error({error: asError(error)}, 'Get chore error');
  return res
    .status(500)
    .json({success: false as const, error: 'Internal server error'});
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

const processChoreUpdateFields = (validatedBody: UpdateChore) => {
  const updateFields: Array<string> = [];
  const values: Array<string | number | null> = [];

  for (const {field, column} of CHORE_UPDATE_FIELD_MAPPINGS) {
    const value = (validatedBody as Record<string, unknown>)[field];
    if (value !== undefined) {
      updateFields.push(`${column} = ?`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- safe cast from validated input
      values.push(value as string | number | null);
    }
  }

  if (updateFields.length === 0) {
    throw new Error('No fields to update');
  }

  return {updateFields, values};
};

const buildChoreUpdateQuery = (validatedBody: UpdateChore, choreId: number) => {
  const {updateFields, values} = processChoreUpdateFields(validatedBody);

  // Add updated_at and id to values
  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(choreId);

  return {updateFields, values};
};

const executeChoreUpdate = (
  updateFields: Array<string>,
  values: Array<string | number | null>,
): Chore => {
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

const parseUpdateChoreRequest = (req: express.Request) => {
  const {id} = IdParamSchema.parse(req.params);
  const validatedBody = UpdateChoreSchema.parse(req.body);
  return {choreId: id, validatedBody};
};

const processChoreUpdate = (choreId: number, validatedBody: UpdateChore) => {
  validateUpdateChoreInput(choreId);
  checkChoreExists(choreId);

  const {updateFields, values} = buildChoreUpdateQuery(validatedBody, choreId);
  const validatedChore = executeChoreUpdate(updateFields, values);

  logger.info({choreId}, 'Chore updated');
  return validatedChore;
};

const handleUpdateChoreError = (error: unknown, res: express.Response) => {
  if (error instanceof z.ZodError) {
    logger.warn({error}, 'Update chore validation error');
    return res
      .status(400)
      .json({
        success: false as const,
        error: 'Invalid request data',
        details: error.stack,
      });
  }

  logger.error({error: asError(error)}, 'Update chore error');
  return res
    .status(500)
    .json({success: false as const, error: 'Internal server error'});
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

const parseDeleteChoreRequest = (req: express.Request) => {
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

const handleDeleteChoreError = (error: unknown, res: express.Response) => {
  if (error instanceof Error && error.message === 'Invalid chore ID') {
    return res
      .status(400)
      .json({success: false as const, error: 'Invalid chore ID'});
  }

  if (error instanceof Error && error.message === 'Chore not found') {
    return res
      .status(404)
      .json({success: false as const, error: 'Chore not found'});
  }

  logger.error({error: asError(error)}, 'Delete chore error');
  return res
    .status(500)
    .json({success: false as const, error: 'Internal server error'});
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

const calculateCompletionPoints = (chore: Chore) => {
  const pointsEarned = chore.point_reward;
  const bonusPointsEarned = 0; // TODO: Implement bonus logic
  const penaltyPointsEarned = 0; // TODO: Implement penalty logic
  return {pointsEarned, bonusPointsEarned, penaltyPointsEarned};
};

const updateChoreAssignmentCompletion = (params: ChoreCompletionParams) => {
  const {choreId, userId, points, notes} = params;
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
  chore: Chore,
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

const parseChoreCompletionRequest = (req: express.Request) => {
  const {id} = IdParamSchema.parse(req.params);
  const {userId, notes} = CompleteChoreBodySchema.parse(req.body);
  return {choreId: id, userId, notes};
};

const executeChoreCompletionTransaction = (
  choreId: number,
  userId: number,
  notes?: string,
): {chore: Chore; pointsEarned: number} => {
  const transaction = db.transaction(() => {
    findChoreAssignment(choreId, userId);
    const chore = getChoreForCompletion(choreId);
    const points = calculateCompletionPoints(chore);

    updateChoreAssignmentCompletion({choreId, userId, points, notes});
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

const handleChoreCompletionError = (error: unknown, res: express.Response) => {
  if (error instanceof Error && error.message.includes('not found')) {
    return res
      .status(404)
      .json({success: false as const, error: error.message});
  }

  if (error instanceof Error && error.message.includes('already completed')) {
    return res
      .status(400)
      .json({success: false as const, error: error.message});
  }

  logger.error({error: asError(error)}, 'Complete chore error');
  return res
    .status(500)
    .json({success: false as const, error: 'Internal server error'});
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
