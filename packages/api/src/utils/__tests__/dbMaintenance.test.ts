import {describe, expect, jest, test} from '@jest/globals';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {prepare: jest.fn(), pragma: jest.fn()},
}));

describe('dbMaintenance exports', () => {
  test('should export dropAllTables from utils', async () => {
    // Import after mocks
    const utils = await import('../dbMaintenance');
    expect(typeof (utils as any).dropAllTables).toBe('function');
  });
});
