import {UpdateChoreSchema, ChoreSchema} from '@gitterdun/shared';
import {z} from 'zod';
import db from '../lib/db';
import {logger} from './logger';
import {sql} from './sql';
import {checkChoreExists} from './choreCrud';

type UpdateChore = z.infer<typeof UpdateChoreSchema>;
type Chore = z.infer<typeof ChoreSchema>;

const CHORE_UPDATE_FIELD_MAPPINGS = [
  {field: 'title', column: 'title'},
  {field: 'description', column: 'description'},
  {field: 'point_reward', column: 'point_reward'},
  {field: 'bonus_points', column: 'bonus_points'},
  {field: 'penalty_points', column: 'penalty_points'},
  {field: 'due_date', column: 'due_date'},
  {field: 'recurrence_rule', column: 'recurrence_rule'},
  {field: 'chore_type', column: 'chore_type'},
  {field: 'status', column: 'status'},
];

const processChoreUpdateFields = (validatedBody: UpdateChore) => {
  const updateFields: Array<string> = [];
  const values: Array<string | number | null> = [];

  for (const {field, column} of CHORE_UPDATE_FIELD_MAPPINGS) {
    const value = (validatedBody as Record<string, unknown>)[field];
    if (value !== undefined) {
      updateFields.push(`${column} = ?`);
      values.push(value as string | number | null);
    }
  }

  if (updateFields.length === 0) {
    throw new Error('No fields to update');
  }

  return {updateFields, values};
};

const buildChoreUpdateQuery = (validatedBody: UpdateChore, choreId: number) => {
  const {updateFields, values} = processChoreUpdateFields(validatedBody);

  // Add updated_at and id to values
  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(choreId);

  return {updateFields, values};
};

const executeChoreUpdate = (
  updateFields: Array<string>,
  values: Array<string | number | null>,
): Chore => {
  const updateQuery = sql`
    UPDATE chores
    SET
      ${updateFields.join(', ')}
    WHERE
      id = ? RETURNING *
  `;
  const updatedChore = db.prepare(updateQuery).get(...values);
  return ChoreSchema.parse(updatedChore);
};

export const processChoreUpdate = (
  choreId: number,
  validatedBody: UpdateChore,
) => {
  checkChoreExists(choreId);

  const {updateFields, values} = buildChoreUpdateQuery(validatedBody, choreId);
  const validatedChore = executeChoreUpdate(updateFields, values);

  logger.info({choreId}, 'Chore updated');
  return validatedChore;
};
