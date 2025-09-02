import {describe, expect, test, beforeAll, afterAll, jest} from '@jest/globals';
import express from 'express';
import {Server} from 'node:http';
import choreInstanceRoutes from './choreInstances';
import {run, get} from '../utils/crud/db';
import {requireUserId} from '../utils/auth';
import {setupErrorHandling} from '../middleware/errorHandler';

jest.mock('../utils/auth', () => ({requireUserId: jest.fn()}));
jest.mock('../utils/familyOperations', () => ({
  getUserFamily: jest.fn(() => ({id: 1, name: 'Fam', owner_id: 1})),
}));
jest.mock('../utils/crud/db', () => ({
  all: jest.fn(() => []),
  get: jest.fn(() => undefined),
  run: jest.fn(() => undefined),
}));

describe('chore Instances API', () => {
  let app: ReturnType<typeof express> | undefined;
  let server: Server | undefined;
  let baseUrl: string | undefined;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/chore-instances', choreInstanceRoutes);
    setupErrorHandling(app);
    server = app.listen(0);
    const address = server.address();
    if (address === null || typeof address === 'string') {
      throw new Error('Failed to get server address');
    }
    baseUrl = `http://localhost:${address.port}`;
    const mocked = jest.mocked(requireUserId);
    mocked.mockReturnValue(1 as unknown as never);
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>(resolve => {
        server!.close(() => {
          resolve();
        });
      });
    }
  });

  test('gET returns instances shape', async () => {
    const response = await fetch(`${baseUrl!}/api/chore-instances?date=today`, {
      headers: {Authorization: 'Bearer test'},
    });
    const body = await response.json();
    expect(response.status).toBeLessThan(500);
    expect(body).toHaveProperty('success');
    expect(body).toHaveProperty('data');
  });

  test('pOST upserts an instance', async () => {
    const payload = {
      chore_id: 1,
      date: new Date().toISOString(),
      status: 'complete',
      approval_status: 'unapproved',
      notes: 'did it',
    } as const;
    const response = await fetch(`${baseUrl!}/api/chore-instances`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    expect(response.status).toBeLessThan(500);
    expect(body).toHaveProperty('success');
  });

  test('pOST with approval=rejected forces status=incomplete', async () => {
    jest.mocked(get).mockReturnValueOnce(undefined as unknown as never);
    const payload = {
      chore_id: 2,
      date: new Date().toISOString(),
      approval_status: 'rejected' as const,
    };
    const response = await fetch(`${baseUrl!}/api/chore-instances`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    expect(response.status).toBeLessThan(500);
    const call = jest.mocked(run).mock.calls.at(-1)!;
    // Params: chore_id, day, status, approval_status, notes
    expect(call[1]).toBe(2);
    expect(typeof call[2]).toBe('string');
    expect(call[3]).toBe('incomplete');
    expect(call[4]).toBe('rejected');
  });

  test('pOST with status=complete resets approval to unapproved', async () => {
    jest.mocked(get).mockReturnValueOnce(undefined as unknown as never);
    const payload = {
      chore_id: 3,
      date: new Date().toISOString(),
      status: 'complete' as const,
      approval_status: 'approved' as const,
    };
    const response = await fetch(`${baseUrl!}/api/chore-instances`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    expect(response.status).toBeLessThan(500);
    const call = jest.mocked(run).mock.calls.at(-1)!;
    expect(call[1]).toBe(3);
    expect(typeof call[2]).toBe('string');
    expect(call[3]).toBe('complete');
    expect(call[4]).toBe('unapproved');
  });

  test('pOST status=complete prevails over approval=unapproved', async () => {
    jest.mocked(get).mockReturnValueOnce(undefined as unknown as never);
    const payload = {
      chore_id: 4,
      date: new Date().toISOString(),
      status: 'complete' as const,
      approval_status: 'unapproved' as const,
    };
    const response = await fetch(`${baseUrl!}/api/chore-instances`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    expect(response.status).toBeLessThan(500);
    const call = jest.mocked(run).mock.calls.at(-1)!;
    expect(call[1]).toBe(4);
    expect(typeof call[2]).toBe('string');
    expect(call[3]).toBe('complete');
    expect(call[4]).toBe('unapproved');
  });
});
