import {sql} from '../../utils/sql';
import {get} from '../../utils/crud/db';
import {ChoreWithUsernameSchema, CountRowSchema} from '@gitterdun/shared';

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

export const mapRowToSchema = (row: Record<string, unknown>) => {
  const descriptionRaw = row['description'];
  const recurrenceRaw = row['recurrence_rule'];
  const rewardRaw = row['point_reward'];
  const penaltyRaw = row['penalty_points'];

  const description =
    typeof descriptionRaw === 'string' && descriptionRaw.trim() !== ''
      ? descriptionRaw
      : undefined;
  const recurrence =
    typeof recurrenceRaw === 'string' && recurrenceRaw.trim() !== ''
      ? recurrenceRaw
      : undefined;
  const rewardPoints = typeof rewardRaw === 'number' ? rewardRaw : 0;
  const penaltyPoints = typeof penaltyRaw === 'number' ? penaltyRaw : 0;

  return ChoreWithUsernameSchema.parse({
    id: Number(row['id']),
    title: String(row['title']),
    description,
    reward_points: rewardPoints,
    penalty_points: penaltyPoints,
    start_date: undefined,
    due_date: undefined,
    recurrence_rule: recurrence,
    chore_type: String(row['chore_type']),
    status: String(row['status']),
    created_by: Number(row['created_by']),
    created_at: Date.parse(String(row['created_at'])),
    updated_at: Date.parse(String(row['updated_at'])),
    created_by_username: String(row['created_by_username']),
  });
};
