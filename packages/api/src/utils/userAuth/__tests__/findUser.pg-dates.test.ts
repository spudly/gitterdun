import {describe, expect, test, beforeEach, jest} from '@jest/globals';

jest.mock('../../../lib/pgClient', () => ({
  __esModule: true,
  pgQuery: jest.fn(),
}));

describe('findUser returns ISO strings for timestamp fields in PG mode', () => {
  const originalEnv = {...process.env};

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      PG_URL: 'postgresql://user:pass@localhost:5432/db',
    } as Record<string, string>;
  });

  test('created_at/updated_at are strings, not Date', async () => {
    const now = new Date('2024-01-02T03:04:05.678Z');
    const {pgQuery} = await import('../../../lib/pgClient');
    jest
      .mocked(pgQuery)
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            username: 'u',
            email: 'u@example.com',
            password_hash: 'x',
            role: 'user',
            points: 0,
            streak_count: 0,
            created_at: now,
            updated_at: now,
          },
        ],
      } as unknown as import('pg').QueryResult);

    const {findUserByEmail} = await import('../findUser');
    const res = await findUserByEmail('u@example.com');
    expect(res).toBeDefined();
    expect(typeof res?.created_at).toBe('string');
    expect(typeof res?.updated_at).toBe('string');
    expect(res?.created_at).toBe(now.toISOString());
    expect(res?.updated_at).toBe(now.toISOString());
  });
});
