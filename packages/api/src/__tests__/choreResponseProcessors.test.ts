import {describe, expect, test, jest, beforeEach} from '@jest/globals';
import {processChoresRequest} from '../utils/choreResponseProcessors';
import * as crudDb from '../utils/crud/db';

jest.mock('../utils/crud/db', () => ({
  __esModule: true,
  get: jest.fn(),
  all: jest.fn(),
}));

const mockedCrudDb = jest.mocked(crudDb);

describe('choreResponseProcessors normalization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedCrudDb.all.mockResolvedValue([]);
    mockedCrudDb.get.mockResolvedValue({count: 0} as unknown as Record<
      string,
      unknown
    >);
  });

  test('coerces nulls to undefined and returns numeric timestamps', async () => {
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

    mockedCrudDb.all.mockResolvedValue(
      rows as unknown as Array<Record<string, unknown>>,
    );
    mockedCrudDb.get.mockResolvedValue({count: 1} as unknown as Record<
      string,
      unknown
    >);

    const result = await processChoresRequest({});
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    const [chore] = result.data;
    expect(chore).toBeDefined();

    // Nulls coerced to undefined
    expect(chore).toHaveProperty('start_date');
    expect(chore?.start_date).toBeUndefined();
    expect(chore).toHaveProperty('due_date');
    expect(chore?.due_date).toBeUndefined();
    expect(chore).toHaveProperty('recurrence_rule');
    expect(chore?.recurrence_rule).toBeUndefined();

    // Numeric timestamps
    expect(typeof chore?.created_at).toBe('number');
    expect(typeof chore?.updated_at).toBe('number');
    // And valid dates
    expect(Number.isNaN(chore?.created_at)).toBe(false);
    expect(Number.isNaN(chore?.updated_at)).toBe(false);
  });

  // status is not part of chore definition; no defaulting behavior expected here
});
