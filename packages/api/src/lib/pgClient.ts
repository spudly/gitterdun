import {Pool, types} from 'pg';
import type {PoolClient, QueryResult} from 'pg';
import {AsyncLocalStorage} from 'node:async_hooks';
import {parseISO} from 'date-fns';
import {getPostgresUrl} from '../utils/env.js';

let pool: Pool | null = null;

// Configure PostgreSQL type parsers to return Date objects for date/timestamp columns
const parseDate = (val: string | null): Date | null =>
  val === null ? null : parseISO(val);

// Set type parsers for PostgreSQL date/timestamp types (skip in test environment where pg is mocked)
// eslint-disable-next-line ts/no-unnecessary-condition, ts/strict-boolean-expressions -- types can be undefined in mocked test environment
if (types && typeof types.setTypeParser === 'function') {
  types.setTypeParser(types.builtins.DATE, parseDate); // DATE
  types.setTypeParser(types.builtins.TIMESTAMP, parseDate); // TIMESTAMP
  types.setTypeParser(types.builtins.TIMESTAMPTZ, parseDate); // TIMESTAMPTZ
}

const shouldUseSsl = (url: string): boolean => {
  try {
    const {hostname} = new URL(url);
    const host = hostname.toLowerCase();
    if (host.includes('render.com')) {
      return true;
    }
    if (host.includes('neon.tech')) {
      return true;
    }
    if (host === 'localhost' || host === '127.0.0.1') {
      return false;
    }
    // Default to false unless we recognize a managed host requiring ssl
    return false;
  } catch {
    return false;
  }
};

const getPgPool = (): Pool => {
  if (pool !== null) {
    return pool;
  }
  const url = getPostgresUrl();
  if (url === null) {
    throw new Error('Postgres URL not configured');
  }
  const ssl = shouldUseSsl(url) ? {rejectUnauthorized: false} : undefined;
  pool = new Pool({connectionString: url, max: 10, ssl});
  return pool;
};

const txContext = new AsyncLocalStorage<PoolClient>();

export const withPgTransaction = async <T>(
  fn: () => Promise<T>,
): Promise<T> => {
  const client = await getPgPool().connect();
  try {
    await client.query('BEGIN');
    const result = await txContext.run(client, async () => fn());
    await client.query('COMMIT');
    return result;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (_rollbackError: unknown) {
      // ignore rollback error
    }
    throw error;
  } finally {
    client.release();
  }
};

// Helper function to format parameters before sending to PostgreSQL
const formatParam = (
  param: unknown,
  _query?: string,
  _paramIndex?: number,
): unknown => {
  // Convert numeric timestamps (milliseconds) to Date objects for PostgreSQL
  if (typeof param === 'number' && param >= 0) {
    // Check if it looks like a JavaScript timestamp (reasonable range)
    // Timestamps should be >= 0 (Unix epoch) and < 2^53 (JavaScript max safe integer)
    if (param <= Number.MAX_SAFE_INTEGER) {
      return new Date(param);
    }
  }
  return param;
};

// Enhanced formatter that can consider query context
const formatParams = (
  params: Array<unknown>,
  query: string,
): Array<unknown> => {
  return params.map((param, index) => formatParam(param, query, index));
};

export const pgQuery = async (
  text: string,
  params: Array<unknown>,
): Promise<QueryResult<Record<string, unknown>>> => {
  // Format parameters to handle numeric timestamps
  const formattedParams = formatParams(params, text);

  const activeClient = txContext.getStore();
  if (activeClient !== undefined) {
    return activeClient.query(text, formattedParams);
  }
  return getPgPool().query(text, formattedParams);
};
