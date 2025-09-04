import {describe, expect, jest, test} from '@jest/globals';
import * as familyOps from './familyOperations.js';
import * as invitationOps from './invitationOperations.js';
import * as dbModule from '../lib/db.js';

jest.mock('../lib/db.js', () => {
  const run = jest.fn();
  const get = jest.fn(() => ({
    id: 1,
    name: 'Fam',
    owner_id: 1,
    created_at: '',
  }));
  const all = jest.fn();
  const prepare = jest.fn(() => ({run, get, all}));
  return {__esModule: true, default: {prepare}};
});

// Use real implementations for modules under test

describe('single-family membership enforcement', () => {
  test('createFamily deletes existing memberships using a shared utility', async () => {
    const db = jest.mocked(dbModule).default;
    const prepareSpy = jest.spyOn(db, 'prepare');

    await familyOps.createFamily('Fam', 123);

    // Expect a DELETE FROM family_members statement to be prepared
    expect(prepareSpy).toHaveBeenCalledWith(
      expect.stringMatching(/DELETE\s+FROM\s+family_members/),
    );
  });

  test('ensureFamilyMembership deletes existing memberships using a shared utility', async () => {
    const db = jest.mocked(dbModule).default;
    const prepareSpy = jest.spyOn(db, 'prepare');

    await invitationOps.ensureFamilyMembership(1, 123, 'parent');

    expect(prepareSpy).toHaveBeenCalledWith(
      expect.stringMatching(/DELETE\s+FROM\s+family_members/),
    );
  });
});
