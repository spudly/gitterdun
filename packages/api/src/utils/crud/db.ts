import db from '../../lib/db';
import {isPostgresEnabled} from '../env';
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
): Promise<unknown> => {
  if (isPostgresEnabled()) {
    const {text} = toPgPlaceholders(query);
    await pgQuery(text, params);
    return {changes: 0};
  }
  return db.prepare(query).run(...params);
};

export const get = async (
  query: string,
  ...params: Array<unknown>
): Promise<Record<string, unknown> | undefined> => {
  if (isPostgresEnabled()) {
    const {text} = toPgPlaceholders(query);
    const res = await pgQuery(text, params);
    const first = res.rows[0] as Record<string, unknown> | undefined;
    return first ? normalizeRowValues(first) : undefined;
  }
  return db.prepare(query).get(...params) as
    | Record<string, unknown>
    | undefined;
};

export const all = async (
  query: string,
  ...params: Array<unknown>
): Promise<Array<Record<string, unknown>>> => {
  if (isPostgresEnabled()) {
    const {text} = toPgPlaceholders(query);
    const res = await pgQuery(text, params);
    return res.rows.map(row =>
      normalizeRowValues(row as Record<string, unknown>),
    );
  }
  return db.prepare(query).all(...params) as Array<Record<string, unknown>>;
};

export const pragma = (pragmaCommand: string): void => {
  if (isPostgresEnabled()) {
    // No-op in Postgres mode
    return;
  }
  db.pragma(pragmaCommand);
};

export const transaction = async <T>(fn: () => Promise<T>): Promise<T> => {
  if (isPostgresEnabled()) {
    const {withPgTransaction} = await import('../../lib/pgClient');
    return withPgTransaction(fn);
  }
  // In SQLite (better-sqlite3), the built-in transaction wrapper expects a
  // synchronous function. Because our callers are async, we perform a manual
  // BEGIN/COMMIT/ROLLBACK flow to ensure proper handling.
  db.exec('BEGIN');
  try {
    const result = await fn();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    try {
      db.exec('ROLLBACK');
    } catch (_rollbackError) {
      // ignore rollback error
    }
    throw error;
  }
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
