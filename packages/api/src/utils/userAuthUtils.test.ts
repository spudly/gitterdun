import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import db from '../lib/db';
import {validateRegistrationData} from './userAuthUtils';

jest.mock('../lib/db', () => ({
  __esModule: true,
  default: {prepare: jest.fn()},
}));

const mockDb = jest.mocked(db);

describe('userAuthUtils - registration validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('allows registration without email when username not taken', () => {
    // Simulate no existing user match
    mockDb.prepare.mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    } as never);

    const result = validateRegistrationData({
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

  test('rejects registration when username already exists', () => {
    // Simulate existing user match on username
    mockDb.prepare.mockReturnValue({
      get: jest.fn().mockReturnValue({id: 1}),
    } as never);

    expect(() =>
      validateRegistrationData({username: 'spudly', password: 'test'}),
    ).toThrow('User with this email or username already exists');
  });
});
