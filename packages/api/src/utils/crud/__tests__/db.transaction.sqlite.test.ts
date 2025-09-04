import {describe, expect, jest, test, beforeEach} from '@jest/globals';

// Mock better-sqlite3 Database.exec to observe BEGIN/COMMIT/ROLLBACK
jest.mock('../../../lib/db', () => {
  const begin = jest.fn();
  const commit = jest.fn();
  const rollback = jest.fn();

  const exec = jest.fn((sql: string) => {
    const upper = sql.trim().toUpperCase();
    if (upper.startsWith('BEGIN')) {
      begin();
    } else if (upper === 'COMMIT') {
      commit();
    } else if (upper === 'ROLLBACK') {
      rollback();
    }
  });

  return {
    __esModule: true,
    default: {exec, prepare: jest.fn(), pragma: jest.fn()},
    __mocks__: {begin, commit, rollback},
  };
});

jest.mock('../../env', () => ({
  __esModule: true,
  isPostgresEnabled: jest.fn(() => false),
}));

describe('sqlite transaction async handling', () => {
  let transaction: <T>(fn: () => Promise<T>) => Promise<T>;

  beforeEach(async () => {
    jest.resetModules();
    const {transaction: tx} = await import('../db');
    transaction = tx;
    const {__mocks__: mocks} = await import('../../../lib/db');
    mocks.begin.mockClear();
    mocks.commit.mockClear();
    mocks.rollback.mockClear();
  });

  test('commits when async function resolves', async () => {
    const {__mocks__: mocks} = await import('../../../lib/db');
    const result = await transaction(async () => {
      await Promise.resolve();
      return 42;
    });
    expect(result).toBe(42);
    expect(mocks.begin).toHaveBeenCalledTimes(1);
    expect(mocks.commit).toHaveBeenCalledTimes(1);
    expect(mocks.rollback).not.toHaveBeenCalled();
  });

  test('rolls back when async function rejects', async () => {
    const {__mocks__: mocks} = await import('../../../lib/db');
    await expect(
      transaction(async () => {
        await Promise.resolve();
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');

    expect(mocks.begin).toHaveBeenCalledTimes(1);
    expect(mocks.commit).not.toHaveBeenCalled();
    expect(mocks.rollback).toHaveBeenCalledTimes(1);
  });
});
