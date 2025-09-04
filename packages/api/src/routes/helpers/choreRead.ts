import {sql} from '../../utils/sql';
import {get} from '../../utils/crud/db';
import {ChoreWithUsernameSchema, CountRowSchema} from '@gitterdun/shared';

export type DbChoreRow = {
  id: number;
  title: string;
  description: string | null;
  point_reward: number;
  bonus_points: number;
  penalty_points: number;
  due_date: string | null;
  recurrence_rule: string | null;
  chore_type: string;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  created_by_username: string;
};

export const DEFAULT_LIMIT = 10;

export const fetchTotalChores = async (): Promise<number> => {
  const countRow = await get(sql`
    SELECT
      COUNT(*) AS count
    FROM
      chores c
      JOIN users u ON u.id = c.created_by
  `);
  const {count} = CountRowSchema.parse(countRow ?? {count: 0});
  return count;
};

export const buildFilters = (
  status: string | undefined,
  choreType: string | undefined,
  userId: number | undefined,
): {where: string; params: Array<string | number>} => {
  let where = '';
  const params: Array<string | number> = [];
  if (status !== undefined) {
    where += ' WHERE 1 = 1';
  }
  if (choreType !== undefined) {
    where += where ? ' AND c.chore_type = ?' : ' WHERE c.chore_type = ?';
    params.push(choreType);
  }
  if (userId !== undefined) {
    where += where ? ' AND c.created_by = ?' : ' WHERE c.created_by = ?';
    params.push(userId);
  }
  return {where, params};
};

export const mapRowToSchema = (row: DbChoreRow) => {
  const description =
    typeof row.description === 'string' && row.description.trim() !== ''
      ? row.description
      : undefined;
  const recurrence =
    typeof row.recurrence_rule === 'string' && row.recurrence_rule.trim() !== ''
      ? row.recurrence_rule
      : undefined;
  const rewardPoints =
    typeof row.point_reward === 'number' ? row.point_reward : 0;
  const penaltyPoints =
    typeof row.penalty_points === 'number' ? row.penalty_points : 0;

  return ChoreWithUsernameSchema.parse({
    id: row.id,
    title: row.title,
    description,
    reward_points: rewardPoints,
    penalty_points: penaltyPoints,
    start_date: undefined,
    due_date: undefined,
    recurrence_rule: recurrence,
    chore_type: row.chore_type,
    status: row.status,
    created_by: row.created_by,
    created_at: Date.parse(row.created_at),
    updated_at: Date.parse(row.updated_at),
    created_by_username: row.created_by_username,
  });
};
