import {ChoreSchema} from '@gitterdun/shared';
import {z} from 'zod';
import {sql} from './sql';
import {get, run} from './crud/db';

type Chore = z.infer<typeof ChoreSchema>;

const toTimestamp = (value: unknown): number | undefined => {
  if (typeof value !== 'string' || value.length === 0) {
    return undefined;
  }
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }
  const candidate = `${value.replace(' ', 'T')}Z`;
  const parsedCandidate = Date.parse(candidate);
  if (!Number.isNaN(parsedCandidate)) {
    return parsedCandidate;
  }
  return undefined;
};

const requireTimestamp = (value: unknown, fieldName: string): number => {
  const ts = toTimestamp(value);
  if (ts == null) {
    throw new Error(`Invalid or missing timestamp for ${fieldName}`);
  }
  return ts;
};

export const getChoreForCompletion = async (choreId: number) => {
  const choreRow = await get(
    sql`
      SELECT
        id,
        title,
        description,
        reward_points,
        penalty_points,
        due_date,
        recurrence_rule,
        chore_type,
        created_by,
        created_at,
        updated_at
      FROM
        chores
      WHERE
        id = ?
    `,
    choreId,
  );

  if (choreRow === undefined) {
    throw new Error('Chore not found');
  }

  const base = choreRow;
  const normalized = {
    ...base,
    start_date: toTimestamp(base['start_date']) ?? undefined,
    due_date: toTimestamp(base['due_date']) ?? undefined,
    recurrence_rule:
      (base['recurrence_rule'] as string | null | undefined) ?? undefined,
    created_at: requireTimestamp(base['created_at'], 'created_at'),
    updated_at: requireTimestamp(base['updated_at'], 'updated_at'),
  };

  return ChoreSchema.parse(normalized);
};

export const calculateCompletionPoints = (chore: Chore) => {
  const pointsEarned =
    typeof chore.reward_points === 'number' ? chore.reward_points : 0;
  const bonusPointsEarned = 0; // merged into reward_points
  const penaltyPointsEarned = 0; // TODO: Implement penalty logic
  return {pointsEarned, bonusPointsEarned, penaltyPointsEarned};
};

export const updateUserPointsForChore = async (
  userId: number,
  totalPoints: number,
) => {
  await run(
    sql`
      UPDATE users
      SET
        points = points + ?
      WHERE
        id = ?
    `,
    totalPoints,
    userId,
  );
};

export const createChoreCompletionNotification = async (
  userId: number,
  chore: Chore,
  choreId: number,
) => {
  await run(
    sql`
      INSERT INTO
        notifications (user_id, title, message, type, related_id)
      VALUES
        (?, ?, ?, ?, ?)
    `,
    userId,
    'Chore Completed',
    `Your chore "${chore.title}" has been completed and is pending approval.`,
    'chore_completed',
    choreId,
  );
};
