import {pgQuery} from '../../lib/pgClient.js';
import {z} from 'zod';

// Date/timestamp columns are now automatically parsed as Date objects by types.setTypeParser
// No need for manual normalization since we want to keep them as Date objects

// (no-op placeholder for potential SQL value escaping removed)

const toPgPlaceholders = (
  query: string,
): {text: string; paramCount: number} => {
  let text = '';
  let next = 1;
  for (const ch of query) {
    if (ch === '?') {
      text += `$${next}`;
      next++;
    } else {
      text += ch;
    }
  }
  return {text, paramCount: next - 1};
};

export const run = async (
  query: string,
  ...params: Array<unknown>
): Promise<{changes: number}> => {
  const {text} = toPgPlaceholders(query);
  await pgQuery(text, params);
  return {changes: 0};
};

export const all = async (
  query: string,
  ...params: Array<unknown>
): Promise<Array<Record<string, unknown>>> => {
  const {text} = toPgPlaceholders(query);
  const res = await pgQuery(text, params);
  return res.rows;
};

export const get = async (
  query: string,
  ...params: Array<unknown>
): Promise<Record<string, unknown> | undefined> =>
  (await all(query, ...params)).at(0);

export const pragma = (_pragmaCommand: string): void => {
  // No-op in Postgres-only mode
};

export const transaction = async <T>(fn: () => Promise<T>): Promise<T> => {
  const {withPgTransaction} = await import('../../lib/pgClient.js');
  return withPgTransaction(fn);
};

// Strongly-typed helpers that parse query results using Zod
export const allTyped = async <TSchema extends z.ZodType>(
  schema: TSchema,
  query: string,
  ...params: Array<unknown>
): Promise<Array<z.infer<TSchema>>> => {
  const rows = await all(query, ...params);
  return schema.array().parse(rows) as Array<z.infer<TSchema>>;
};

export const getTyped = async <TSchema extends z.ZodType>(
  schema: TSchema,
  query: string,
  ...params: Array<unknown>
): Promise<z.infer<TSchema> | undefined> => {
  const row = await get(query, ...params);
  if (row === undefined) {
    return undefined;
  }
  return schema.parse(row) as z.infer<TSchema>;
};
