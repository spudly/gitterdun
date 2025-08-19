import {sql} from './sql';

type ChoreFilters = {
  status?: string | undefined;
  choreType?: string | undefined;
  userId?: number | undefined;
};

type FilterResult = {queryAddition: string; param?: string | number};

const getBaseChoresQuery = () => {
  return sql`
    SELECT
      c.id,
      c.title,
      c.description,
      c.point_reward,
      c.bonus_points,
      c.penalty_points,
      c.due_date,
      c.recurrence_rule,
      c.chore_type,
      c.status,
      c.created_by,
      c.created_at,
      c.updated_at,
      u.username AS created_by_username
    FROM
      chores c
      LEFT JOIN users u ON c.created_by = u.id
    WHERE
      1 = 1
  `;
};

const getStatusFilter = (status?: string): FilterResult => {
  return status != null
    ? {queryAddition: ' AND c.status = ?', param: status}
    : {queryAddition: ''};
};

const getChoreTypeFilter = (choreType?: string): FilterResult => {
  return choreType != null
    ? {queryAddition: ' AND c.chore_type = ?', param: choreType}
    : {queryAddition: ''};
};

const getUserIdFilter = (userId?: number): FilterResult => {
  return userId != null
    ? {
        queryAddition:
          ' AND c.id IN (SELECT chore_id FROM chore_assignments WHERE user_id = ?)',
        param: userId,
      }
    : {queryAddition: ''};
};

const applyChoreFilters = (
  baseQuery: string,
  {status, choreType, userId}: ChoreFilters,
) => {
  const statusFilter = getStatusFilter(status);
  const choreTypeFilter = getChoreTypeFilter(choreType);
  const userIdFilter = getUserIdFilter(userId);

  const query =
    baseQuery
    + statusFilter.queryAddition
    + choreTypeFilter.queryAddition
    + userIdFilter.queryAddition;
  const params = [
    statusFilter.param,
    choreTypeFilter.param,
    userIdFilter.param,
  ].filter(param => param !== undefined);

  return {query, params};
};

export const buildChoresQuery = (
  status?: string,
  choreType?: string,
  userId?: number,
) => {
  const baseQuery = getBaseChoresQuery();
  return applyChoreFilters(baseQuery, {status, choreType, userId});
};
