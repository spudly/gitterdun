import {describe, expect, jest, test} from '@jest/globals';

jest.mock('../lib/initDb', () => ({
  __esModule: true,
  initializeDatabase: jest.fn(async () => undefined),
}));
jest.mock('../utils/dbMaintenance', () => ({
  __esModule: true,
  dropAllTables: jest.fn(() => undefined),
}));
jest.mock('../utils/logger', () => ({
  __esModule: true,
  logger: {info: jest.fn()},
}));
jest.mock('../utils/familyOperations', () => ({
  __esModule: true,
  createFamily: jest.fn(() => ({id: 1})),
  addChildToFamily: jest.fn(() => undefined),
}));
jest.mock('../utils/userAuth/createNewUser', () => ({
  __esModule: true,
  createNewUser: jest.fn(async ({username}) => ({
    id: username === 'parent' ? 1 : 2,
  })),
}));
jest.mock('../utils/choreCrud', () => ({
  __esModule: true,
  createChoreInDb: jest.fn(() => ({id: 1})),
  assignChoreToUsers: jest.fn(() => undefined),
}));

describe('dbReset script', () => {
  test('resetDb seeds only when --seed passed', async () => {
    const mod = await import('../scripts/dbReset.js');
    const {resetDb} = mod as unknown as {
      resetDb: (opts?: {seed?: boolean}) => Promise<void>;
    };

    const {createChoreInDb} = await import('../utils/choreCrud.js');

    // Run without seed
    await resetDb({seed: false});
    expect(jest.mocked(createChoreInDb)).not.toHaveBeenCalled();

    // Run with seed
    jest.mocked(createChoreInDb).mockClear();
    await resetDb({seed: true});
    expect(jest.mocked(createChoreInDb)).toHaveBeenCalledWith(
      expect.objectContaining({title: expect.any(String)}),
    );
  });
});
