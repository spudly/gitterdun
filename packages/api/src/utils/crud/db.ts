import {pgQuery} from '../../lib/pgClient';
import {z} from 'zod';

const normalizeRowValues = (
  row: Record<string, unknown>,
): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (value instanceof Date) {
      out[key] = value.toISOString();
    } else {
      out[key] = value;
    }
  }
  return out;
};

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

export const get = async (
  query: string,
  ...params: Array<unknown>
): Promise<Record<string, unknown> | undefined> => {
  const {text} = toPgPlaceholders(query);
  const res = await pgQuery(text, params);
  const [first] = res.rows;
  return first ? normalizeRowValues(first) : undefined;
};

export const all = async (
  query: string,
  ...params: Array<unknown>
): Promise<Array<Record<string, unknown>>> => {
  const {text} = toPgPlaceholders(query);
  const res = await pgQuery(text, params);
  return res.rows.map(row => normalizeRowValues(row));
};

export const pragma = (_pragmaCommand: string): void => {
  // No-op in Postgres-only mode
};

export const transaction = async <T>(fn: () => Promise<T>): Promise<T> => {
  const {withPgTransaction} = await import('../../lib/pgClient');
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
