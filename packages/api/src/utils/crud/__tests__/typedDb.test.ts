import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import {z} from 'zod';
import {listUsers} from '../users';
import {UserSchema} from '@gitterdun/shared';
import {allTyped, getTyped} from '../db';
import {pgQuery} from '../../../lib/pgClient';

jest.mock('../../../lib/pgClient', () => ({
  __esModule: true,
  pgQuery: jest.fn(),
}));

const mockedPgQuery = jest.mocked(pgQuery);

describe('typed DB helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('allTyped parses rows with provided schema', async () => {
    const rows = [
      {id: 1, name: 'ok'},
      {id: 2, name: 'ok2'},
    ];
    mockedPgQuery.mockResolvedValueOnce({
      rows,
    } as unknown as import('pg').QueryResult);

    const Row = z.object({id: z.number(), name: z.string()});
    const parsed = await allTyped(Row, 'SELECT 1');

    expect(parsed).toEqual(rows);
  });

  test('getTyped parses single row and returns undefined for no row', async () => {
    const row = {id: 42, name: 'one'};
    const Row = z.object({id: z.number(), name: z.string()});

    // First: found
    mockedPgQuery.mockResolvedValueOnce({
      rows: [row],
    } as unknown as import('pg').QueryResult);
    const found = await getTyped(Row, 'SELECT 1');
    expect(found).toEqual(row);

    // Second: not found
    mockedPgQuery.mockResolvedValueOnce({
      rows: [],
    } as unknown as import('pg').QueryResult);
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

    mockedPgQuery.mockResolvedValueOnce({
      rows: [validUser],
    } as unknown as import('pg').QueryResult);

    const users = (await listUsers()) as Array<unknown>;
    // If listUsers integrates zod parsing, this parse should be a no-op pass
    expect(() => UserSchema.array().parse(users)).not.toThrow();
  });
});
