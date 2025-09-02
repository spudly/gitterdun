import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import db from '../../../lib/db';
import {findUserByEmail, findUserByUsername} from '../findUser';

describe('findUser utils', () => {
  const prepareMock = jest.fn();
  const getMock = jest.fn();

  beforeEach(() => {
    prepareMock.mockReturnValue({get: getMock});
    jest.spyOn(db, 'prepare').mockImplementation(prepareMock as never);
    getMock.mockReset();
  });

  test('findUserByEmail returns undefined when db.get returns null', () => {
    getMock.mockReturnValueOnce(null);
    const result = findUserByEmail('nosuch@example.com');
    expect(result).toBeUndefined();
  });

  test('findUserByEmail returns undefined when db.get returns undefined', () => {
    getMock.mockReturnValueOnce(undefined);
    const result = findUserByEmail('nosuch@example.com');
    expect(result).toBeUndefined();
  });

  test('findUserByUsername returns undefined when db.get returns null', () => {
    getMock.mockReturnValueOnce(null);
    const result = findUserByUsername('nosuchuser');
    expect(result).toBeUndefined();
  });

  test('findUserByUsername returns undefined when db.get returns undefined', () => {
    getMock.mockReturnValueOnce(undefined);
    const result = findUserByUsername('nosuchuser');
    expect(result).toBeUndefined();
  });
});
