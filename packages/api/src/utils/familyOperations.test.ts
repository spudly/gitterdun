import {describe, expect, jest, test, beforeEach} from '@jest/globals';
import {getFamilyMembers} from './familyOperations.js';
import * as crudDb from './crud/db.js';

jest.mock('./crud/db.js', () => ({
  __esModule: true,
  run: jest.fn(),
  get: jest.fn(),
  all: jest.fn(),
}));

describe('getFamilyMembers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return empty array when no family members exist', async () => {
    const mockedCrud = jest.mocked(crudDb);
    mockedCrud.all.mockResolvedValueOnce([]);

    const result = await getFamilyMembers(1);

    expect(result).toEqual([]);
    expect(mockedCrud.all).toHaveBeenCalledWith(
      expect.stringMatching(
        /SELECT.*fm\.family_id.*fm\.user_id.*fm\.role.*u\.username.*u\.email.*FROM.*family_members fm.*JOIN users u/s,
      ),
      1,
    );
  });

  test('should return family members with user details', async () => {
    const mockedCrud = jest.mocked(crudDb);
    const mockRows = [
      {
        family_id: 1,
        user_id: 2,
        role: 'parent',
        username: 'parent1',
        email: 'parent@example.com',
      },
      {
        family_id: 1,
        user_id: 3,
        role: 'child',
        username: 'child1',
        email: 'child@example.com',
      },
    ];
    mockedCrud.all.mockResolvedValueOnce(mockRows);

    const result = await getFamilyMembers(1);

    expect(result).toEqual([
      {
        family_id: 1,
        user_id: 2,
        role: 'parent',
        username: 'parent1',
        email: 'parent@example.com',
      },
      {
        family_id: 1,
        user_id: 3,
        role: 'child',
        username: 'child1',
        email: 'child@example.com',
      },
    ]);
    expect(mockedCrud.all).toHaveBeenCalledTimes(1);
  });

  test('should handle members with null email', async () => {
    const mockedCrud = jest.mocked(crudDb);
    const mockRows = [
      {
        family_id: 1,
        user_id: 2,
        role: 'child',
        username: 'child1',
        email: null,
      },
    ];
    mockedCrud.all.mockResolvedValueOnce(mockRows);

    const result = await getFamilyMembers(1);

    expect(result).toEqual([
      {
        family_id: 1,
        user_id: 2,
        role: 'child',
        username: 'child1',
        email: null,
      },
    ]);
  });

  test('should query with correct family_id parameter', async () => {
    const mockedCrud = jest.mocked(crudDb);
    mockedCrud.all.mockResolvedValueOnce([]);

    await getFamilyMembers(42);

    expect(mockedCrud.all).toHaveBeenCalledWith(expect.any(String), 42);
  });
});
