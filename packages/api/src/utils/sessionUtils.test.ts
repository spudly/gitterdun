import {describe, expect, jest, test} from '@jest/globals';
import type express from 'express';
import db from '../lib/db';

jest.mock('../lib/db', () => ({
  __esModule: true,
  default: {prepare: jest.fn()},
}));

describe('sessionUtils', () => {
  test('getUserFromSession returns null when session row is undefined', async () => {
    const mockDb = jest.mocked(db);
    // First prepare() call is for sessions; return undefined row
    mockDb.prepare.mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as import('better-sqlite3').Statement);

    const {getUserFromSession} = await import('./sessionUtils');
    const req = {headers: {cookie: 'sid=abc'}} as unknown as express.Request;

    expect(() => getUserFromSession(req)).not.toThrow();
    expect(getUserFromSession(req)).toBeNull();
  });
});
