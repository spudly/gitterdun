import {describe, expect, test, beforeEach, jest} from '@jest/globals';

jest.mock('../../pg/psql', () => ({
  __esModule: true,
  psqlExecFileInput: jest.fn(),
  psqlQuerySingleColumn: jest.fn(),
  psqlQuerySingleNumber: jest.fn(),
}));

jest.mock('../../../lib/pgClient', () => ({
  __esModule: true,
  pgQuery: jest.fn(),
  withPgTransaction: jest.fn(async (fn: () => Promise<unknown>) => fn()),
}));

describe('init helpers in Postgres mode (native client)', () => {
  const originalEnv = {...process.env};

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      PG_URL: 'postgresql://user:pass@localhost:5432/giterdone_postgres',
    } as Record<string, string>;
  });

  test('execSchema uses pg client, not psql', async () => {
    const {pgQuery} = await import('../../../lib/pgClient.js');
    const {psqlExecFileInput} = await import('../../pg/psql.js');
    const {execSchema} = await import('../init.js');

    await expect(
      (async () => {
        await execSchema('CREATE TABLE x(id int)');
      })(),
    ).resolves.toBeUndefined();

    expect(jest.mocked(pgQuery)).toHaveBeenCalledWith(
      'CREATE TABLE x(id int)',
      [],
    );
    expect(jest.mocked(psqlExecFileInput)).not.toHaveBeenCalled();
  });

  test('countAdmins queries via pg client single-row', async () => {
    const {pgQuery} = await import('../../../lib/pgClient.js');
    jest
      .mocked(pgQuery)
      .mockResolvedValueOnce({
        rows: [{count: 2}],
      } as unknown as import('pg').QueryResult);

    const {countAdmins} = await import('../init.js');
    const res = await countAdmins();
    expect(res.count).toBe(2);
    expect(jest.mocked(pgQuery)).toHaveBeenCalledWith(
      'SELECT COUNT(*)::int AS count FROM users WHERE role = $1',
      ['admin'],
    );
  });
});
