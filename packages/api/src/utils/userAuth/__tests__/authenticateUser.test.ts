import {describe, expect, jest, test} from '@jest/globals';
import * as findUser from '../findUser.js';
import {authenticateUser} from '../authenticateUser.js';
jest.mock('../findUser');

describe('authenticateUser', () => {
  test('throws 401 when neither email nor username resolves to a user', async () => {
    jest
      .spyOn(findUser, 'findUserByEmail')
      .mockResolvedValue(undefined as never);
    jest
      .spyOn(findUser, 'findUserByUsername')
      .mockResolvedValue(undefined as never);

    await expect(
      authenticateUser({email: 'nosuch@example.com'}, 'password123'),
    ).rejects.toMatchObject({status: 401});

    await expect(
      authenticateUser({username: 'nosuch'}, 'password123'),
    ).rejects.toMatchObject({status: 401});
  });
});
