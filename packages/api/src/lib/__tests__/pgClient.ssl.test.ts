import {describe, expect, test, beforeEach, jest} from '@jest/globals';

jest.mock('pg', () => ({
  __esModule: true,
  Pool: jest
    .fn()
    .mockImplementation((_opts: unknown) => ({
      connect: jest
        .fn()
        .mockResolvedValue({query: jest.fn(), release: jest.fn()}),
      query: jest.fn(),
    })),
}));

describe('pg client SSL config', () => {
  const originalEnv = {...process.env};

  beforeEach(() => {
    jest.resetModules();
    process.env = {...originalEnv};
  });

  test('sets ssl=require when PG_URL has render.com host', async () => {
    process.env['PG_URL'] = 'postgresql://u:p@dpg-foo.render.com:5432/db';
    const {Pool} = await import('pg');
    const {pgQuery} = await import('../pgClient');
    await pgQuery('SELECT 1', []);
    expect(jest.mocked(Pool)).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionString: process.env['PG_URL'],
        max: 10,
        ssl: {rejectUnauthorized: false},
      }),
    );
  });

  test('no ssl config for localhost', async () => {
    process.env['PG_URL'] = 'postgresql://u:p@localhost:5432/db';
    const {Pool} = await import('pg');
    const {pgQuery} = await import('../pgClient');
    await pgQuery('SELECT 1', []);
    expect(jest.mocked(Pool)).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionString: process.env['PG_URL'],
        max: 10,
      }),
    );
    expect(jest.mocked(Pool)).not.toHaveBeenCalledWith(
      expect.objectContaining({ssl: expect.anything()}),
    );
  });
});
