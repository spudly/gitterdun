import {ChoreSchema} from '@gitterdun/shared';
import db from '../lib/db';
import {logger} from './logger';
import {sql} from './sql';

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
  pointReward: number;
  bonusPoints: number;
  penaltyPoints: number;
  startDate: number | null;
  dueDate: number | null;
  recurrenceRule: string | null;
  choreType: string;
  createdBy: number;
};

export const fetchChoreById = (choreId: number) => {
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

  const base = chore as Record<string, unknown>;
  const normalized = {
    ...base,
    start_date: toTimestamp(base['start_date']) ?? undefined,
    due_date: toTimestamp(base['due_date']) ?? undefined,
    recurrence_rule:
      (base['recurrence_rule'] as string | null | undefined) ?? undefined,
    created_at: toTimestamp(base['created_at']),
    updated_at: toTimestamp(base['updated_at']),
  };
  return ChoreSchema.parse(normalized);
};

export const createChoreInDb = (params: CreateChoreParams) => {
  const {
    title,
    description,
    pointReward,
    bonusPoints,
    penaltyPoints,
    startDate,
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
          start_date,
          due_date,
          recurrence_rule,
          chore_type,
          created_by
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *
    `)
    .get(
      title,
      description,
      pointReward,
      bonusPoints,
      penaltyPoints,
      // DB stores dates as TEXT; convert numeric timestamps to ISO
      startDate != null ? new Date(startDate).toISOString() : null,
      dueDate != null ? new Date(dueDate).toISOString() : null,
      recurrenceRule,
      choreType,
      createdBy,
    );

  const base = createdRow as Record<string, unknown>;
  const normalized = {
    ...base,
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
      db.prepare(sql`
        INSERT INTO
          chore_assignments (chore_id, user_id)
        VALUES
          (?, ?)
      `).run(choreId, userId);
    });
  }
};

export const checkChoreExists = (choreId: number) => {
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

export const processChoreDelete = (choreId: number) => {
  checkChoreExists(choreId);

  // Delete the chore (chore_assignments will be deleted due to CASCADE)
  db.prepare(sql`
    DELETE FROM chores
    WHERE
      id = ?
  `).run(choreId);

  logger.info({choreId}, 'Chore deleted');
};
