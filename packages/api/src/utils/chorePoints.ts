import {ChoreSchema} from '@gitterdun/shared';
import {z} from 'zod';
import db from '../lib/db';
import {sql} from './sql';

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

export const getChoreForCompletion = (choreId: number) => {
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

  const base = choreRow as Record<string, unknown>;
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
  const pointsEarned = chore.point_reward;
  const bonusPointsEarned =
    typeof chore.bonus_points === 'number' ? chore.bonus_points : 0;
  const penaltyPointsEarned = 0; // TODO: Implement penalty logic
  return {pointsEarned, bonusPointsEarned, penaltyPointsEarned};
};

export const updateUserPointsForChore = (
  userId: number,
  totalPoints: number,
) => {
  db.prepare(sql`
    UPDATE users
    SET
      points = points + ?
    WHERE
      id = ?
  `).run(totalPoints, userId);
};

export const createChoreCompletionNotification = (
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
