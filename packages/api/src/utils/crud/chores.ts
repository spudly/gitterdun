import {sql} from '../sql.js';
import {get, run} from './db.js';
import {z} from 'zod';

const ChoreRowSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  reward_points: z.number().nullable().optional(),
  penalty_points: z.number().nullable().optional(),
  start_date: z.any().optional(),
  due_date: z.any().nullable().optional(),
  recurrence_rule: z.string().nullable().optional(),
  chore_type: z.string(),
  created_by: z.number(),
  created_at: z.any(),
  updated_at: z.any(),
  created_by_username: z.string().nullable().optional(),
});

type ChoreRow = z.infer<typeof ChoreRowSchema>;

export const insertChore = async (params: {
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
}): Promise<ChoreRow> => {
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
  const row = await get(
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
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING
        *
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
  if (row === undefined) {
    throw new Error('Failed to insert chore');
  }
  return ChoreRowSchema.parse(row);
};

export const insertChoreAssignment = async (
  choreId: number,
  userId: number,
) => {
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

export const deleteChoreById = async (choreId: number) => {
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
