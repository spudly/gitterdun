import {
  ChoreWithUsernameSchema,
  OutgoingChoreWithUsernameSchema,
  CountRowSchema,
} from '@gitterdun/shared';
import {z} from 'zod';
import {all, get} from './crud/db.js';
import {buildChoresQuery} from './choreQueryBuilders.js';
import {DEFAULT_CHORE_PAGINATION_LIMIT} from '../constants.js';

type ChoreWithUsername = z.infer<typeof OutgoingChoreWithUsernameSchema>;

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

const getChoresCount = async (
  query: string,
  params: Array<string | number>,
): Promise<number> => {
  const countQuery = query.replace(
    /SELECT[\s\S]*?FROM/u,
    'SELECT COUNT(*) as count FROM',
  );
  const totalRow = await get(countQuery, ...params);
  const {count: total} = CountRowSchema.parse(totalRow);
  return total;
};

const buildPaginatedChoresQuery = ({
  baseQuery,
  params: queryParams,
  page,
  limit,
}: PaginatedQueryParams): {
  finalQuery: string;
  finalParams: Array<string | number>;
} => {
  const finalQuery = `${baseQuery} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
  const offset = (page - 1) * limit;
  const finalParams = [...queryParams, limit, offset];
  return {finalQuery, finalParams};
};

// Schema for parsing database rows with legacy field support and coercion
const DatabaseChoreWithUsernameSchema = ChoreWithUsernameSchema.extend({
  // Handle legacy point_reward field
  reward_points: z.coerce
    .number()
    .optional()
    .transform(val => val ?? 0),
  point_reward: z.coerce.number().optional(),
  // Handle string dates from legacy data, nulls, and existing Date objects
  start_date: z
    .union([
      z.date(),
      z.string().transform(str => new Date(str)),
      z.null().transform(() => undefined),
    ])
    .optional(),
  due_date: z
    .union([
      z.date(),
      z.string().transform(str => new Date(str)),
      z.null().transform(() => undefined),
    ])
    .optional(),
  created_at: z.union([z.date(), z.string().transform(str => new Date(str))]),
  updated_at: z.union([z.date(), z.string().transform(str => new Date(str))]),
  recurrence_rule: z
    .union([z.string(), z.null().transform(() => undefined)])
    .optional(),
}).transform(data => ({
  ...data,
  // Use point_reward as fallback for reward_points if needed
  reward_points: data.point_reward ?? data.reward_points,
  // Remove the legacy field
  point_reward: undefined,
}));

const executeChoresQuery = async (
  query: string,
  params: Array<string | number>,
): Promise<Array<ChoreWithUsername>> => {
  const chores = (await all(query, ...params)) as Array<unknown>;
  return chores.map(raw => {
    // Parse with database schema (handles legacy data) then transform to outgoing format
    const choreInternal = DatabaseChoreWithUsernameSchema.parse(raw);
    return OutgoingChoreWithUsernameSchema.parse(choreInternal);
  });
};

const formatChoresResponse = ({
  chores,
  page,
  limit,
  total,
}: ChoresResponseParams): {
  success: true;
  data: Array<ChoreWithUsername>;
  pagination: {page: number; limit: number; total: number; totalPages: number};
} => {
  return {
    success: true as const,
    data: chores,
    pagination: {page, limit, total, totalPages: Math.ceil(total / limit)},
  };
};

export const processChoresRequest = async ({
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
  const total = await getChoresCount(query, queryParams);

  // Provide default values for pagination
  const safePage = page ?? 1;
  const safeLimit = limit ?? DEFAULT_CHORE_PAGINATION_LIMIT;

  const {finalQuery, finalParams} = buildPaginatedChoresQuery({
    baseQuery: query,
    params: queryParams,
    page: safePage,
    limit: safeLimit,
  });
  const validatedChores = await executeChoresQuery(finalQuery, finalParams);
  return formatChoresResponse({
    chores: validatedChores,
    page: safePage,
    limit: safeLimit,
    total,
  });
};
