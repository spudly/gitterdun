import {beforeEach, describe, expect, jest, test} from '@jest/globals';

describe('choreModeration dialect-specific SQL', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('uses INSERT OR IGNORE when SQLite (default dev)', async () => {
    jest.doMock('./crud/db', () => ({run: jest.fn()}));
    const mod = await import('./choreModeration');
    await mod.assignChoreToSingleUser(1, 2);
    const mockedDb = jest.mocked(jest.requireMock('./crud/db'));
    expect(mockedDb.run).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR IGNORE'),
      1,
      2,
    );
  });

  test('uses ON CONFLICT DO NOTHING when Postgres', async () => {
    const originalEnv = {...process.env};
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      PG_URL: 'postgresql://user:pass@localhost:5432/giterdone_postgres',
    };
    jest.doMock('./crud/db', () => ({run: jest.fn()}));
    const mod = await import('./choreModeration');
    await mod.assignChoreToSingleUser(1, 2);
    const mockedDb = jest.mocked(jest.requireMock('./crud/db'));
    expect(mockedDb.run).toHaveBeenCalledWith(
      expect.stringContaining('ON CONFLICT'),
      1,
      2,
    );
    process.env = originalEnv;
  });
});
