import {describe, expect, jest, test} from '@jest/globals';
import type express from 'express';
import * as crudDb from './crud/db.js';

jest.mock('./crud/db', () => ({__esModule: true, get: jest.fn()}));

describe('sessionUtils', () => {
  test('getUserFromSession returns null when session row is undefined', async () => {
    const mockedCrudDb = jest.mocked(crudDb);
    mockedCrudDb.get.mockResolvedValue(undefined);

    const {getUserFromSession} = await import('./sessionUtils.js');
    const req = {headers: {cookie: 'sid=abc'}} as unknown as express.Request;

    await expect(getUserFromSession(req)).resolves.toBeNull();
  });
});
