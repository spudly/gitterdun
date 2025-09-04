import {describe, expect, jest, test, beforeEach} from '@jest/globals';

jest.mock('./crud/db', () => ({__esModule: true, run: jest.fn()}));

describe('choreModeration helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('exposes approveChoreAssignment function', async () => {
    const originalEnv = {...process.env};
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      PG_URL: 'postgresql://user:pass@localhost:5432/giterdone_postgres',
    } as Record<string, string>;

    const {approveChoreAssignment} = await import('./choreModeration');
    expect(typeof approveChoreAssignment).toBe('function');

    process.env = originalEnv;
  });
});
