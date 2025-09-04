import {describe, expect, test} from '@jest/globals';

// No DB mocking needed; this test only verifies export shape

describe('dbMaintenance exports', () => {
  test('should export dropAllTables from utils', async () => {
    // Import after mocks
    const utils = await import('../dbMaintenance');
    expect(typeof (utils as any).dropAllTables).toBe('function');
  });
});
