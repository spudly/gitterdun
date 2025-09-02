import {GoalSchema} from '@gitterdun/shared';
import {get, run} from './crud/db';
import {sql} from './sql';

export const createGoalInDatabase = (
  title: string,
  description: string | undefined,
  targetPoints: number,
) => {
  const result = get(
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
        (?, ?, ?, ?, ?) RETURNING *
    `,
    title,
    description,
    targetPoints,
    0,
    1,
  );

  return GoalSchema.parse(result);
};

export const fetchGoalById = (goalId: number) => {
  return get(
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
};

export const checkGoalExists = (goalId: number): boolean => {
  const existingGoal = get(
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

export const deleteGoalFromDatabase = (goalId: number): void => {
  run(
    sql`
      DELETE FROM goals
      WHERE
        id = ?
    `,
    goalId,
  );
};
