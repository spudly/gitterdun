import {ChoreSchema} from '@gitterdun/shared';
import {z} from 'zod';
import {sql} from './sql.js';
import {get, run} from './crud/db.js';

type Chore = z.infer<typeof ChoreSchema>;

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

  return ChoreSchema.parse(choreRow);
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
