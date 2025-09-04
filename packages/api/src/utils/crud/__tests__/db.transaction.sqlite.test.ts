import {describe, expect, test, jest} from '@jest/globals';

import {transaction} from '../db';

jest.mock('../../../lib/pgClient', () => ({
  __esModule: true,
  withPgTransaction: jest.fn(async (fn: () => Promise<unknown>) => fn()),
}));

describe('transaction wrapper (postgres-only)', () => {
  test('invokes callback and resolves value', async () => {
    const result = await transaction(async () => 123);
    expect(result).toBe(123);
  });

  test('propagates error from callback', async () => {
    await expect(
      transaction(async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
  });
});
