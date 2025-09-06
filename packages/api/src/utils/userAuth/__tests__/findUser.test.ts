import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import * as crudDb from '../../crud/db.js';
import {findUserByEmail, findUserByUsername} from '../findUser.js';

describe('findUser utils', () => {
  const getMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(crudDb, 'get').mockImplementation(getMock as never);
    getMock.mockReset();
  });

  test('findUserByEmail returns undefined when db.get returns null', async () => {
    getMock.mockReturnValueOnce(null);
    const result = await findUserByEmail('nosuch@example.com');
    expect(result).toBeUndefined();
  });

  test('findUserByEmail returns undefined when db.get returns undefined', async () => {
    getMock.mockReturnValueOnce(undefined);
    const result = await findUserByEmail('nosuch@example.com');
    expect(result).toBeUndefined();
  });

  test('findUserByUsername returns undefined when db.get returns null', async () => {
    getMock.mockReturnValueOnce(null);
    const result = await findUserByUsername('nosuchuser');
    expect(result).toBeUndefined();
  });

  test('findUserByUsername returns undefined when db.get returns undefined', async () => {
    getMock.mockReturnValueOnce(undefined);
    const result = await findUserByUsername('nosuchuser');
    expect(result).toBeUndefined();
  });
});
