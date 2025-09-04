import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import {z} from 'zod';
import db from '../../../lib/db';
import {listUsers} from '../users';
import {UserSchema} from '@gitterdun/shared';
import {allTyped, getTyped} from '../db';

// Mock env to force sqlite code paths (not Postgres)
jest.mock('../../env', () => ({isPostgresEnabled: () => false}));

// Mock the underlying sqlite db interface used by crud/db
jest.mock('../../../lib/db', () => ({
  __esModule: true,
  default: {
    prepare: jest
      .fn()
      .mockReturnValue({all: jest.fn(), get: jest.fn(), run: jest.fn()}),
    transaction: jest.fn(),
    exec: jest.fn(),
    pragma: jest.fn(),
  },
}));

const mockedDb = jest.mocked(db);

describe('typed DB helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('allTyped parses rows with provided schema', async () => {
    const rows = [
      {id: 1, name: 'ok'},
      {id: 2, name: 'ok2'},
    ];
    mockedDb.prepare.mockReturnValue({
      all: jest.fn().mockReturnValue(rows),
      get: jest.fn(),
      run: jest.fn(),
    } as unknown as ReturnType<typeof mockedDb.prepare>);

    const Row = z.object({id: z.number(), name: z.string()});
    const parsed = await allTyped(Row, 'SELECT 1');

    expect(parsed).toEqual(rows);
  });

  test('getTyped parses single row and returns undefined for no row', async () => {
    const row = {id: 42, name: 'one'};
    const Row = z.object({id: z.number(), name: z.string()});

    // First: found
    mockedDb.prepare.mockReturnValueOnce({
      all: jest.fn(),
      get: jest.fn().mockReturnValue(row),
      run: jest.fn(),
    } as unknown as ReturnType<typeof mockedDb.prepare>);
    const found = await getTyped(Row, 'SELECT 1');
    expect(found).toEqual(row);

    // Second: not found
    mockedDb.prepare.mockReturnValueOnce({
      all: jest.fn(),
      get: jest.fn().mockReturnValue(undefined),
      run: jest.fn(),
    } as unknown as ReturnType<typeof mockedDb.prepare>);
    const notFound = await getTyped(Row, 'SELECT 1 WHERE 0');
    expect(notFound).toBeUndefined();
  });

  test('listUsers returns users parsed via zod schema', async () => {
    const validUser = {
      id: 1,
      username: 'test',
      email: 'test@example.com',
      role: 'user' as const,
      points: 0,
      streak_count: 0,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    };

    mockedDb.prepare.mockReturnValue({
      all: jest.fn().mockReturnValue([validUser]),
      get: jest.fn(),
      run: jest.fn(),
    } as unknown as ReturnType<typeof mockedDb.prepare>);

    const users = (await listUsers()) as Array<unknown>;
    // If listUsers integrates zod parsing, this parse should be a no-op pass
    expect(() => UserSchema.array().parse(users)).not.toThrow();
  });
});
