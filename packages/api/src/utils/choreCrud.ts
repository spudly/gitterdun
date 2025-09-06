import {ChoreSchema} from '@gitterdun/shared';
import {z} from 'zod';
import {
  insertChore,
  insertChoreAssignment,
  deleteChoreById,
} from './crud/chores.js';
import {logger} from './logger.js';
import {sql} from './sql.js';
import {get} from './crud/db.js';

type CreateChoreParams = {
  title: string;
  description: string;
  rewardPoints: number | null;
  penaltyPoints: number;
  startDate: number | null;
  dueDate: number | null;
  recurrenceRule: string | null;
  choreType: string;
  createdBy: number;
  familyId: number;
};

export const createChoreInDb = async (params: CreateChoreParams) => {
  const {
    title,
    description,
    rewardPoints,
    penaltyPoints,
    startDate,
    dueDate,
    recurrenceRule,
    choreType,
    createdBy,
    familyId,
  } = params;
  const createdRow = await insertChore({
    title,
    description,
    rewardPoints: rewardPoints ?? 0,
    penaltyPoints,
    startDateIso: startDate != null ? new Date(startDate).toISOString() : null,
    dueDateIso: dueDate != null ? new Date(dueDate).toISOString() : null,
    recurrenceRule,
    choreType,
    createdBy,
    familyId,
  });

  const CoercedChoreSchema = ChoreSchema.extend({
    start_date: z.date(),
    due_date: z.date(),
    recurrence_rule: z
      .union([z.string(), z.undefined(), z.null()])
      .transform(value => (value == null || value === '' ? undefined : value))
      .optional(),
    created_at: z.date(),
    updated_at: z.date(),
  });

  return CoercedChoreSchema.parse(createdRow);
};

export const assignChoreToUsers = async (
  choreId: number,
  assignedUsers: Array<number>,
) => {
  if (assignedUsers.length > 0) {
    for (const userId of assignedUsers) {
      // eslint-disable-next-line no-await-in-loop -- serialize inserts
      await insertChoreAssignment(choreId, userId);
    }
  }
};

export const checkChoreExists = async (choreId: number) => {
  const existingChore = await get(
    sql`
      SELECT
        id
      FROM
        chores
      WHERE
        id = ?
    `,
    choreId,
  );

  if (existingChore === undefined) {
    throw new Error('Chore not found');
  }
  return existingChore;
};

export const processChoreDelete = async (choreId: number) => {
  await checkChoreExists(choreId);

  // Delete the chore (chore_assignments will be deleted due to CASCADE)
  await deleteChoreById(choreId);

  logger.info({choreId}, 'Chore deleted');
};
