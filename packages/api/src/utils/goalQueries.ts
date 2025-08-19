import {GoalQuerySchema, GoalSchema, CountRowSchema} from '@gitterdun/shared';
import {z} from 'zod';
import db from '../lib/db';
import {sql} from './sql';

type Goal = z.infer<typeof GoalSchema>;

type GoalsQueryParams = {
  userId: number;
  status?: string | undefined;
  page: number;
  limit: number;
};

type QueryWithParams = {query: string; params: Array<string | number>};
type PaginationConfig = {page: number; limit: number};

export const validateGoalsQuery = (query: unknown): GoalsQueryParams => {
  const validatedQuery = GoalQuerySchema.parse(query);
  const {user_id: userId, status, page, limit} = validatedQuery;

  if (userId === undefined) {
    throw Object.assign(new Error('User ID is required'), {status: 400});
  }

  return {userId, status, page, limit};
};

export const buildGoalsQuery = (
  userId: number,
  status?: string,
): QueryWithParams => {
  let query = sql`
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
      user_id = ?
  `;
  const params: Array<string | number> = [userId];

  if (status !== undefined && status !== '') {
    query += ' AND status = ?';
    params.push(status);
  }

  return {query, params};
};

export const getTotalGoalsCount = (
  baseQuery: string,
  params: Array<string | number>,
): number => {
  const countQuery = baseQuery.replace(
    /SELECT[\s\S]*?FROM/,
    'SELECT COUNT(*) as total FROM',
  );
  const totalRow = db.prepare(countQuery).get(...params);
  const {count: total} = CountRowSchema.parse(totalRow);
  return total;
};

export const addPaginationToQuery = (
  baseQuery: string,
  params: Array<string | number>,
  pagination: PaginationConfig,
): QueryWithParams => {
  const {page, limit} = pagination;
  const query = `${baseQuery} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  const offset = (page - 1) * limit;
  const paginatedParams = [...params, limit, offset];
  return {query, params: paginatedParams};
};

export const fetchAndValidateGoals = (
  query: string,
  params: Array<string | number>,
): Array<Goal> => {
  const goals = db.prepare(query).all(...params);
  return goals.map(goal => GoalSchema.parse(goal));
};
