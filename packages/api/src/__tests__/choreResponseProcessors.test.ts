import {describe, expect, test, jest, beforeEach} from '@jest/globals';
import {processChoresRequest} from '../utils/choreResponseProcessors';
import db from '../lib/db';

jest.mock('../lib/db', () => ({
  __esModule: true,
  default: {prepare: jest.fn()},
}));

const mockDb = jest.mocked(db);

describe('choreResponseProcessors normalization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('coerces nulls to undefined and returns numeric timestamps', () => {
    const rows = [
      {
        id: 1,
        title: 'Test Chore',
        description: 'desc',
        point_reward: 5,
        bonus_points: 0,
        penalty_points: 0,
        start_date: null,
        due_date: null,
        recurrence_rule: null,
        chore_type: 'required',
        status: 'pending',
        created_by: 1,
        created_at: '2024-01-01 12:34:56',
        updated_at: '2024-01-02 01:02:03',
        created_by_username: 'admin',
      },
    ];

    const mockAll = jest.fn().mockReturnValue(rows);
    const mockGet = jest.fn().mockReturnValue({count: 1});
    mockDb.prepare.mockImplementation((query: string) => {
      if (query.includes('COUNT(*)')) {
        return {get: mockGet} as unknown as ReturnType<typeof db.prepare>;
      }
      return {all: mockAll} as unknown as ReturnType<typeof db.prepare>;
    });

    const result = processChoresRequest({});
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    const chore = result.data[0]!;

    // Nulls coerced to undefined
    expect('start_date' in chore).toBe(true);
    expect(chore.start_date).toBeUndefined();
    expect('due_date' in chore).toBe(true);
    expect(chore.due_date).toBeUndefined();
    expect('recurrence_rule' in chore).toBe(true);
    expect(chore.recurrence_rule).toBeUndefined();

    // Numeric timestamps
    expect(typeof chore.created_at).toBe('number');
    expect(typeof chore.updated_at).toBe('number');
    // And valid dates
    expect(Number.isNaN(chore.created_at)).toBe(false);
    expect(Number.isNaN(chore.updated_at)).toBe(false);
  });
});
