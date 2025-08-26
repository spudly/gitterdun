import {ChoreWithUsernameSchema, CountRowSchema} from '@gitterdun/shared';
import {z} from 'zod';
import db from '../lib/db';
import {buildChoresQuery} from './choreQueryBuilders';

type ChoreWithUsername = z.infer<typeof ChoreWithUsernameSchema>;

type PaginatedQueryParams = {
  baseQuery: string;
  params: Array<string | number>;
  page: number;
  limit: number;
};

type ChoresResponseParams = {
  chores: Array<ChoreWithUsername>;
  page: number;
  limit: number;
  total: number;
};

type ProcessChoresParams = {
  status?: string | undefined;
  choreType?: string | undefined;
  userId?: number | undefined;
  page?: number | undefined;
  limit?: number | undefined;
};

const getChoresCount = (query: string, params: Array<string | number>) => {
  const countQuery = query.replace(
    /SELECT[\s\S]*?FROM/u,
    'SELECT COUNT(*) as count FROM',
  );
  const totalRow = db.prepare(countQuery).get(...params);
  const {count: total} = CountRowSchema.parse(totalRow);
  return total;
};

const buildPaginatedChoresQuery = ({
  baseQuery,
  params: queryParams,
  page,
  limit,
}: PaginatedQueryParams) => {
  const finalQuery = `${baseQuery} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
  const offset = (page - 1) * limit;
  const finalParams = [...queryParams, limit, offset];
  return {finalQuery, finalParams};
};

const executeChoresQuery = (
  query: string,
  params: Array<string | number>,
): Array<ChoreWithUsername> => {
  const chores = db.prepare(query).all(...params);
  return chores.map(chore => ChoreWithUsernameSchema.parse(chore));
};

const formatChoresResponse = ({
  chores,
  page,
  limit,
  total,
}: ChoresResponseParams) => {
  return {
    success: true as const,
    data: chores,
    pagination: {page, limit, total, totalPages: Math.ceil(total / limit)},
  };
};

export const processChoresRequest = ({
  status,
  choreType,
  userId,
  page,
  limit,
}: ProcessChoresParams) => {
  const {query, params: queryParams} = buildChoresQuery(
    status,
    choreType,
    userId,
  );
  const total = getChoresCount(query, queryParams);

  // Provide default values for pagination
  const safePage = page ?? 1;
  const safeLimit = limit ?? 10;

  const {finalQuery, finalParams} = buildPaginatedChoresQuery({
    baseQuery: query,
    params: queryParams,
    page: safePage,
    limit: safeLimit,
  });
  const validatedChores = executeChoresQuery(finalQuery, finalParams);
  return formatChoresResponse({
    chores: validatedChores,
    page: safePage,
    limit: safeLimit,
    total,
  });
};
