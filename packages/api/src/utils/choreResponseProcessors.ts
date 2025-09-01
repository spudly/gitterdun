import {ChoreWithUsernameSchema, CountRowSchema} from '@gitterdun/shared';
import {z} from 'zod';
import db from '../lib/db';
import {buildChoresQuery} from './choreQueryBuilders';
import {DEFAULT_CHORE_PAGINATION_LIMIT} from '../constants';

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
  sortBy?: 'created_at' | 'start_date' | 'due_date' | undefined;
  order?: 'asc' | 'desc' | undefined;
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

const toTimestamp = (value: unknown): number | undefined => {
  if (typeof value !== 'string' || value.length === 0) {
    return undefined;
  }
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }
  const candidate = `${value.replace(' ', 'T')}Z`;
  const parsedCandidate = Date.parse(candidate);
  if (!Number.isNaN(parsedCandidate)) {
    return parsedCandidate;
  }
  return undefined;
};

const requireTimestamp = (value: unknown, fieldName: string): number => {
  const ts = toTimestamp(value);
  if (ts == null) {
    throw new Error(`Invalid or missing timestamp for ${fieldName}`);
  }
  return ts;
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
  return chores.map(raw => {
    const base = raw as Record<string, unknown>;
    const normalized = {
      ...base,
      start_date: toTimestamp(base['start_date']) ?? undefined,
      due_date: toTimestamp(base['due_date']) ?? undefined,
      recurrence_rule:
        (base['recurrence_rule'] as string | null | undefined) ?? undefined,
      created_at: requireTimestamp(base['created_at'], 'created_at'),
      updated_at: requireTimestamp(base['updated_at'], 'updated_at'),
    };
    return ChoreWithUsernameSchema.parse(normalized);
  });
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
  sortBy,
  order,
}: ProcessChoresParams) => {
  const {query, params: queryParams} = buildChoresQuery(
    status,
    choreType,
    userId,
    sortBy,
    order,
  );
  const total = getChoresCount(query, queryParams);

  // Provide default values for pagination
  const safePage = page ?? 1;
  const safeLimit = limit ?? DEFAULT_CHORE_PAGINATION_LIMIT;

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
