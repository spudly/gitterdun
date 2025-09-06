import {describe, expect, jest, test} from '@jest/globals';
import * as familyOps from './familyOperations.js';
import * as invitationOps from './invitationOperations.js';
import * as membershipUtil from './familyMembership.js';

jest.mock('./familyMembership.js');
jest.mock('./crud/db.js', () => ({
  __esModule: true,
  run: jest.fn(),
  get: jest.fn(() => ({
    id: 1,
    name: 'Fam',
    owner_id: 1,
    created_at: new Date(),
  })),
  all: jest.fn(() => []),
}));

describe('shared family membership removal', () => {
  test('createFamily calls removeAllMembershipsForUser', async () => {
    const mockedUtil = jest.mocked(membershipUtil);
    mockedUtil.removeAllMembershipsForUser.mockClear();
    await familyOps.createFamily('Fam', 42);
    expect(mockedUtil.removeAllMembershipsForUser).toHaveBeenCalledWith(42);
  });

  test('ensureFamilyMembership calls removeAllMembershipsForUser', async () => {
    const mockedUtil = jest.mocked(membershipUtil);
    mockedUtil.removeAllMembershipsForUser.mockClear();
    await invitationOps.ensureFamilyMembership(7, 99, 'parent');
    expect(mockedUtil.removeAllMembershipsForUser).toHaveBeenCalledWith(99);
  });
});
