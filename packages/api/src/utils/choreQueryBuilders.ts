import {sql} from './sql';

type ChoreFilters = {
  status?: string | undefined;
  choreType?: string | undefined;
  userId?: number | undefined;
  sortBy?: 'created_at' | 'start_date' | 'due_date' | undefined;
  order?: 'asc' | 'desc' | undefined;
};

type FilterResult = {queryAddition: string; param?: string | number};

const getBaseChoresQuery = () => {
  return sql`
    SELECT
      c.*,
      u.username AS created_by_username
    FROM
      chores c
      LEFT JOIN users u ON c.created_by = u.id
    WHERE
      1 = 1
  `;
};

// Status is no longer persisted on chores; compute from assignments when needed.
const getStatusFilter = (_status?: string): FilterResult => {
  return {queryAddition: ''};
};

const getChoreTypeFilter = (choreType?: string): FilterResult => {
  return choreType != null
    ? {queryAddition: ' AND c.chore_type = ?', param: choreType}
    : {queryAddition: ''};
};

const getUserIdFilter = (_userId?: number): FilterResult => ({
  queryAddition: '',
});

const getFamilyFilter = (familyId?: number): FilterResult => {
  return familyId != null
    ? {queryAddition: ' AND c.family_id = ?', param: familyId}
    : {queryAddition: ''};
};

const applyChoreFilters = (
  baseQuery: string,
  {status, choreType, userId, sortBy, order}: ChoreFilters,
) => {
  const statusFilter = getStatusFilter(status);
  const choreTypeFilter = getChoreTypeFilter(choreType);
  const userIdFilter = getUserIdFilter(userId);
  // Interpret userId as the family id to filter chores by family
  const familyFilter = getFamilyFilter(userId);

  let query =
    baseQuery
    + statusFilter.queryAddition
    + choreTypeFilter.queryAddition
    + userIdFilter.queryAddition
    + familyFilter.queryAddition;

  if (sortBy) {
    const direction = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const allowed = ['created_at', 'start_date', 'due_date'] as const;
    const safeColumn = allowed.includes(sortBy) ? sortBy : 'created_at';
    query += ` ORDER BY c.${safeColumn} ${direction}`;
  }
  const params = [
    statusFilter.param,
    choreTypeFilter.param,
    userIdFilter.param,
    familyFilter.param,
  ].filter(param => param !== undefined);

  return {query, params};
};

export const buildChoresQuery = (
  status?: string,
  choreType?: string,
  userId?: number,
  sortBy?: 'created_at' | 'start_date' | 'due_date',
  order?: 'asc' | 'desc',
) => {
  const baseQuery = getBaseChoresQuery();
  return applyChoreFilters(baseQuery, {
    status,
    choreType,
    userId,
    sortBy,
    order,
  });
};
