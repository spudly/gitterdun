import {describe, expect, jest, test} from '@jest/globals';

jest.mock('../crud/db', () => ({
  __esModule: true,
  transaction: jest.fn(async (fn: () => Promise<unknown>) => fn()),
}));

jest.mock('../chorePoints', () => ({
  __esModule: true,
  getChoreForCompletion: jest.fn(async () => ({
    id: 1,
    title: 'Test',
    description: '',
    reward_points: 5,
    penalty_points: 0,
    due_date: null,
    recurrence_rule: undefined,
    chore_type: 'one_time',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })),
  calculateCompletionPoints: jest.fn(() => ({
    pointsEarned: 5,
    bonusPointsEarned: 0,
    penaltyPointsEarned: 0,
  })),
  updateUserPointsForChore: jest.fn(async () => undefined),
  createChoreCompletionNotification: jest.fn(async () => undefined),
}));

jest.mock('../choreAssignments', () => ({
  __esModule: true,
  findChoreAssignment: jest.fn(async () => ({id: 1})),
  updateChoreAssignmentCompletion: jest.fn(async () => undefined),
}));

describe('executeChoreCompletionTransaction', () => {
  test('uses shared transaction helper', async () => {
    const {executeChoreCompletionTransaction} = await import(
      '../choreCompletion.js'
    );
    const {transaction} = await import('../crud/db.js');

    // Run
    const result = await executeChoreCompletionTransaction(1, 2, 'done');

    // Assert
    expect(jest.mocked(transaction)).toHaveBeenCalledTimes(1);
    expect(result).toEqual({chore: expect.any(Object), pointsEarned: 5});
  });
});
