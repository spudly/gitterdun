import {ChoreSchema} from '@gitterdun/shared';
import {
  insertChore,
  insertChoreAssignment,
  selectChoreById,
  deleteChoreById,
} from './crud/chores';
import {logger} from './logger';
import {sql} from './sql';
import {get} from './crud/db';

const toTimestamp = (value: unknown): number | undefined => {
  if (typeof value !== 'string' || value.length === 0) {
    return undefined;
  }
  const direct = Date.parse(value);
  if (!Number.isNaN(direct)) {
    return direct;
  }
  const candidate = `${value.replace(' ', 'T')}Z`;
  const parsedCandidate = Date.parse(candidate);
  if (!Number.isNaN(parsedCandidate)) {
    return parsedCandidate;
  }
  return undefined;
};

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

export const fetchChoreById = (choreId: number) => {
  const chore = selectChoreById(choreId);

  if (chore === undefined) {
    throw new Error('Chore not found');
  }

  const base = chore as Record<string, unknown>;
  const normalized = {
    ...base,
    reward_points:
      typeof base['reward_points'] === 'number' ? base['reward_points'] : 0,
    start_date: toTimestamp(base['start_date']) ?? undefined,
    due_date: toTimestamp(base['due_date']) ?? undefined,
    recurrence_rule:
      (base['recurrence_rule'] as string | null | undefined) ?? undefined,
    created_at: toTimestamp(base['created_at']),
    updated_at: toTimestamp(base['updated_at']),
  };
  try {
    return ChoreSchema.parse(normalized);
  } catch (_err) {
    return ChoreSchema.parse(normalized);
  }
};

export const createChoreInDb = (params: CreateChoreParams) => {
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
  const createdRow = insertChore({
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

  const base = createdRow as Record<string, unknown>;
  const normalized = {
    ...base,
    reward_points:
      typeof base['reward_points'] === 'number' ? base['reward_points'] : 0,
    start_date: toTimestamp(base['start_date']) ?? undefined,
    due_date: toTimestamp(base['due_date']) ?? undefined,
    recurrence_rule:
      (base['recurrence_rule'] as string | null | undefined) ?? undefined,
    created_at: toTimestamp(base['created_at']),
    updated_at: toTimestamp(base['updated_at']),
  };
  return ChoreSchema.parse(normalized);
};

export const assignChoreToUsers = (
  choreId: number,
  assignedUsers: Array<number>,
) => {
  if (assignedUsers.length > 0) {
    assignedUsers.forEach(userId => {
      insertChoreAssignment(choreId, userId);
    });
  }
};

export const checkChoreExists = (choreId: number) => {
  const existingChore = get(
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

export const processChoreDelete = (choreId: number) => {
  checkChoreExists(choreId);

  // Delete the chore (chore_assignments will be deleted due to CASCADE)
  deleteChoreById(choreId);

  logger.info({choreId}, 'Chore deleted');
};
