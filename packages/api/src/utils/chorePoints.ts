import {ChoreSchema} from '@gitterdun/shared';
import {z} from 'zod';
import db from '../lib/db';
import {sql} from './sql';

type Chore = z.infer<typeof ChoreSchema>;

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

  return ChoreSchema.parse(choreRow);
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
