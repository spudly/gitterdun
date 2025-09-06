import {GoalSchema} from '@gitterdun/shared';
import {get, run} from './crud/db.js';
import {sql} from './sql.js';

export const createGoalInDatabase = async (
  title: string,
  description: string | undefined,
  targetPoints: number,
) => {
  const result = await get(
    sql`
      INSERT INTO
        goals (
          title,
          description,
          target_points,
          current_points,
          user_id
        )
      VALUES
        (?, ?, ?, ?, ?)
      RETURNING
        *
    `,
    title,
    description,
    targetPoints,
    0,
    1,
  );

  return GoalSchema.parse(result);
};

export const fetchGoalById = async (goalId: number) => {
  const goalRow = await get(
    sql`
      SELECT
        id,
        user_id,
        title,
        description,
        target_points,
        current_points,
        status,
        created_at,
        updated_at
      FROM
        goals
      WHERE
        id = ?
    `,
    goalId,
  );
  return goalRow === undefined ? undefined : GoalSchema.parse(goalRow);
};

export const checkGoalExists = async (goalId: number): Promise<boolean> => {
  const existingGoal = await get(
    sql`
      SELECT
        id
      FROM
        goals
      WHERE
        id = ?
    `,
    goalId,
  );
  return existingGoal !== undefined;
};

export const deleteGoalFromDatabase = async (goalId: number): Promise<void> => {
  await run(
    sql`
      DELETE FROM goals
      WHERE
        id = ?
    `,
    goalId,
  );
};
