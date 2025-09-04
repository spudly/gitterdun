import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import * as crudDb from './crud/db';
import {validateRegistrationData} from './userAuthUtils';

jest.mock('./crud/db', () => ({__esModule: true, get: jest.fn()}));

const mockedCrudDb = jest.mocked(crudDb);

describe('userAuthUtils - registration validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('allows registration without email when username not taken', async () => {
    // Simulate no existing user match
    mockedCrudDb.get.mockResolvedValue(undefined);

    const result = await validateRegistrationData({
      username: 'spudly',
      password: 'test',
    });
    expect(result).toEqual({
      username: 'spudly',
      email: undefined,
      password: 'test',
      role: 'user',
    });
  });

  test('rejects registration when username already exists', async () => {
    // Simulate existing user match on username
    mockedCrudDb.get.mockResolvedValue({id: 1} as unknown as Record<
      string,
      unknown
    >);

    await expect(
      validateRegistrationData({username: 'spudly', password: 'test'}),
    ).rejects.toThrow('User with this email or username already exists');
  });
});
