import {
  describe,
  expect,
  test,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import express from 'express';
import {Server} from 'node:http';
import type {Statement} from 'better-sqlite3';
import {
  ChoreWithUsernameSchema,
  ChoreQuerySchema,
  CountRowSchema,
} from '@gitterdun/shared';
import choresRouter from './chores';
import db from '../lib/db';
import {setupErrorHandling} from '../middleware/errorHandler';

// Mocks
jest.mock('../lib/db', () => ({
  __esModule: true,
  default: {prepare: jest.fn()},
}));
jest.mock('@gitterdun/shared');

const mockDb = jest.mocked(db);
const mockedChoreQuerySchema = jest.mocked(ChoreQuerySchema);
const mockedChoreSchema = jest.mocked(ChoreWithUsernameSchema);
const mockedCountRowSchema = jest.mocked(CountRowSchema);

describe('chores routes', () => {
  let app: ReturnType<typeof express> | undefined;
  let server: Server | undefined;
  let baseUrl: string | undefined;

  beforeEach(async () => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use('/api/chores', choresRouter);
    setupErrorHandling(app);

    server = app.listen(0);
    const address = server.address();
    if (address === null || typeof address === 'string') {
      throw new Error('Failed to get server address');
    }
    baseUrl = `http://localhost:${address.port}`;
  });

  afterEach(async () => {
    if (server) {
      await new Promise<void>(resolve => {
        server!.close(() => {
          resolve();
        });
      });
    }
  });

  test('get /api/chores returns paginated list with defaults', async () => {
    const mockChores = [
      {
        id: 1,
        title: 'Test Chore',
        description: 'desc',
        point_reward: 5,
        bonus_points: 0,
        penalty_points: 0,
        due_date: undefined,
        recurrence_rule: undefined,
        chore_type: 'required',
        status: 'pending',
        created_by: 1,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
        created_by_username: 'admin',
      },
    ];

    const mockPreparedStatement = {
      get: jest.fn().mockReturnValue({count: 1}),
      all: jest.fn().mockReturnValue(mockChores),
    } as unknown as Statement;
    mockDb.prepare.mockReturnValue(mockPreparedStatement);

    mockedChoreQuerySchema.parse.mockReturnValue({
      status: undefined,
      chore_type: undefined,
      user_id: undefined,
      page: 1,
      limit: 10,
    });
    mockedCountRowSchema.parse.mockReturnValue({count: 1});
    mockedChoreSchema.parse.mockReturnValue(mockChores[0]!);

    const response = await fetch(`${baseUrl!}/api/chores`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: [mockChores[0]],
      pagination: {page: 1, limit: 10, total: 1, totalPages: 1},
    });
  });
});
