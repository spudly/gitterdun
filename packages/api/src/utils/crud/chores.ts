import {sql} from '../sql';
import {get, run} from './db';

export const insertChore = (params: {
  title: string;
  description: string;
  rewardPoints: number | null;
  penaltyPoints: number;
  startDateIso: string | null;
  dueDateIso: string | null;
  recurrenceRule: string | null;
  choreType: string;
  createdBy: number;
  familyId: number;
}) => {
  const {
    title,
    description,
    rewardPoints,
    penaltyPoints,
    startDateIso,
    dueDateIso,
    recurrenceRule,
    choreType,
    createdBy,
    familyId,
  } = params;
  return get(
    sql`
      INSERT INTO
        chores (
          title,
          description,
          reward_points,
          penalty_points,
          start_date,
          due_date,
          recurrence_rule,
          chore_type,
          created_by,
          family_id
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *
    `,
    title,
    description,
    rewardPoints,
    penaltyPoints,
    startDateIso,
    dueDateIso,
    recurrenceRule,
    choreType,
    createdBy,
    familyId,
  );
};

export const selectChoreById = (choreId: number) => {
  return get(
    sql`
      SELECT
        c.id,
        c.title,
        c.description,
        c.reward_points,
        c.penalty_points,
        c.due_date,
        c.recurrence_rule,
        c.chore_type,
        c.created_by,
        c.created_at,
        c.updated_at,
        u.username AS created_by_username
      FROM
        chores c
        LEFT JOIN users u ON c.created_by = u.id
      WHERE
        c.id = ?
    `,
    choreId,
  );
};

export const insertChoreAssignment = (choreId: number, userId: number) => {
  return run(
    sql`
      INSERT INTO
        chore_assignments (chore_id, user_id)
      VALUES
        (?, ?)
    `,
    choreId,
    userId,
  );
};

export const deleteChoreById = (choreId: number) => {
  return run(
    sql`
      DELETE FROM chores
      WHERE
        id = ?
    `,
    choreId,
  );
};

/* removed unused helpers: selectChores, countRows, updateChore */
