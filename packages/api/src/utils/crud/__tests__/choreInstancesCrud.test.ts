import {beforeEach, describe, expect, jest, test} from '@jest/globals';

describe('crud/choreInstances upsert SQL per dialect', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('uses ON CONFLICT DO UPDATE when SQLite (default dev)', async () => {
    jest.doMock('../db', () => ({run: jest.fn()}));
    const crud = await import('../choreInstances');
    await crud.upsertChoreInstance(
      1,
      '2025-01-01',
      'incomplete',
      'unapproved',
      null,
    );
    const mockedDb = jest.mocked(jest.requireMock('../db'));
    expect(mockedDb.run).toHaveBeenCalledWith(
      expect.stringContaining(
        'ON CONFLICT (chore_id, instance_date) DO UPDATE',
      ),
      1,
      '2025-01-01',
      'incomplete',
      'unapproved',
      null,
    );
  });

  test('uses ON CONFLICT DO UPDATE when Postgres', async () => {
    const originalEnv = {...process.env};
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      PG_URL: 'postgresql://user:pass@localhost:5432/giterdone_postgres',
    };
    jest.doMock('../db', () => ({run: jest.fn()}));
    const crud = await import('../choreInstances');
    await crud.upsertChoreInstance(
      1,
      '2025-01-01',
      'complete',
      'unapproved',
      'note',
    );
    const mockedDb = jest.mocked(jest.requireMock('../db'));
    expect(mockedDb.run).toHaveBeenCalledWith(
      expect.stringContaining(
        'ON CONFLICT (chore_id, instance_date) DO UPDATE',
      ),
      1,
      '2025-01-01',
      'complete',
      'unapproved',
      'note',
    );
    process.env = originalEnv;
  });
});
