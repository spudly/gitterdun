import {Pool} from 'pg';
import type {PoolClient, QueryResult} from 'pg';
import {AsyncLocalStorage} from 'node:async_hooks';
import {getPostgresUrl} from '../utils/env';

let pool: Pool | null = null;

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
    } catch (_rollbackError) {
      // ignore rollback error
    }
    throw error;
  } finally {
    client.release();
  }
};

export const pgQuery = async (
  text: string,
  params: ReadonlyArray<unknown>,
): Promise<QueryResult> => {
  const activeClient = txContext.getStore();
  if (activeClient !== undefined) {
    return activeClient.query(text, params);
  }
  return getPgPool().query(text, params);
};
