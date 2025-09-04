import {describe, expect, jest, test, beforeEach} from '@jest/globals';

jest.mock('../db', () => ({__esModule: true, run: jest.fn()}));

describe('choreInstances CRUD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('module compiles and exports functions', async () => {
    const mod = await import('../choreInstances');
    expect(typeof mod.upsertChoreInstance).toBe('function');
  });
});
