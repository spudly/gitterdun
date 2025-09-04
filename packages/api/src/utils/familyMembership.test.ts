import {describe, expect, jest, test} from '@jest/globals';
import * as familyOps from './familyOperations.js';
import * as invitationOps from './invitationOperations.js';
import * as crudDb from './crud/db.js';

jest.mock('./crud/db.js', () => ({
  __esModule: true,
  run: jest.fn(),
  get: jest.fn(() => ({id: 1, name: 'Fam', owner_id: 1, created_at: ''})),
  all: jest.fn(() => []),
}));

// Use real implementations for modules under test

describe('single-family membership enforcement', () => {
  test('createFamily deletes existing memberships using a shared utility', async () => {
    const mockedCrud = jest.mocked(crudDb);
    const runSpy = jest.spyOn(mockedCrud, 'run');

    await familyOps.createFamily('Fam', 123);

    // Expect a DELETE FROM family_members statement to be executed
    expect(runSpy).toHaveBeenCalledWith(
      expect.stringMatching(/DELETE\s+FROM\s+family_members/),
      expect.anything(),
    );
  });

  test('ensureFamilyMembership deletes existing memberships using a shared utility', async () => {
    const mockedCrud = jest.mocked(crudDb);
    const runSpy = jest.spyOn(mockedCrud, 'run');

    await invitationOps.ensureFamilyMembership(1, 123, 'parent');

    expect(runSpy).toHaveBeenCalledWith(
      expect.stringMatching(/DELETE\s+FROM\s+family_members/),
      expect.anything(),
    );
  });
});
