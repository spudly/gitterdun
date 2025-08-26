import {ChoreSchema} from '@gitterdun/shared';
import db from '../lib/db';
import {logger} from './logger';
import {sql} from './sql';

type CreateChoreParams = {
  title: string;
  description: string;
  pointReward: number;
  bonusPoints: number;
  penaltyPoints: number;
  startDate: string | null;
  dueDate: string | null;
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

  return ChoreSchema.parse(chore);
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
        (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *
    `)
    .get(
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
    );

  return ChoreSchema.parse(createdRow);
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
