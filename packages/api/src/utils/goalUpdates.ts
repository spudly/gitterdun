import {GoalSchema} from '@gitterdun/shared';
import {z} from 'zod';
import {get} from './crud/db';
import {sql} from './sql';
import type {UpdateGoalRequest} from './goalValidation';

type Goal = z.infer<typeof GoalSchema>;

type UpdateQueryBuilder = {
  updateFields: Array<string>;
  values: Array<string | number>;
};

const addUpdateField = (
  builder: UpdateQueryBuilder,
  field: string,
  value: string | number | undefined,
): void => {
  if (value !== undefined) {
    builder.updateFields.push(`${field} = ?`);
    builder.values.push(value);
  }
};

export const buildGoalUpdateQuery = (
  updateData: UpdateGoalRequest['updateData'],
): UpdateQueryBuilder => {
  const builder: UpdateQueryBuilder = {updateFields: [], values: []};

  addUpdateField(builder, 'title', updateData.title);
  addUpdateField(builder, 'description', updateData.description);
  addUpdateField(builder, 'target_points', updateData.target_points);
  addUpdateField(builder, 'current_points', updateData.current_points);
  addUpdateField(builder, 'status', updateData.status);

  if (builder.updateFields.length === 0) {
    throw Object.assign(new Error('No fields to update'), {status: 400});
  }

  builder.updateFields.push('updated_at = CURRENT_TIMESTAMP');
  return builder;
};

export const executeGoalUpdate = async (
  goalId: number,
  builder: UpdateQueryBuilder,
): Promise<Goal> => {
  const values = [...builder.values, goalId];
  const updateQuery = sql`
    UPDATE goals
    SET
      ${builder.updateFields.join(', ')}
    WHERE
      id = ?
    RETURNING
      *
  `;
  const updatedGoal = await get(updateQuery, ...values);
  return GoalSchema.parse(updatedGoal);
};
