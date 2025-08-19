import {GoalSchema} from '@gitterdun/shared';
import db from '../lib/db';
import {sql} from './sql';

export const createGoalInDatabase = (
  title: string,
  description: string | undefined,
  targetPoints: number,
) => {
  const result = db
    .prepare(sql`
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
    `)
    .get(title, description, targetPoints, 0, 1);

  return GoalSchema.parse(result);
};

export const fetchGoalById = (goalId: number) => {
  return db
    .prepare(sql`
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
    `)
    .get(goalId);
};

export const checkGoalExists = (goalId: number): boolean => {
  const existingGoal = db
    .prepare(sql`
      SELECT
        id
      FROM
        goals
      WHERE
        id = ?
    `)
    .get(goalId);
  return existingGoal !== undefined;
};

export const deleteGoalFromDatabase = (goalId: number): void => {
  db.prepare(sql`
    DELETE FROM goals
    WHERE
      id = ?
  `).run(goalId);
};
