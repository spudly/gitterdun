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
import nock from 'nock';
import type {Statement} from 'better-sqlite3';
import {
  LeaderboardRowSchema,
  LeaderboardQuerySchema,
  LeaderboardEntrySchema,
  asError,
} from '@gitterdun/shared';
import leaderboardRouter from './leaderboard';
import db from '../lib/db';
import {setupErrorHandling} from '../middleware/errorHandler';
import {logger} from '../utils/logger';
import {ZodError} from 'zod';

// Mock dependencies
jest.mock('../lib/db', () => ({
  __esModule: true,
  default: {prepare: jest.fn()},
}));

jest.mock('../utils/logger', () => ({
  logger: {info: jest.fn(), error: jest.fn(), warn: jest.fn()},
}));

jest.mock('@gitterdun/shared');

const mockDb = jest.mocked(db);
const mockLogger = jest.mocked(logger);
const mockedLeaderboardRowSchema = jest.mocked(LeaderboardRowSchema);
const mockedLeaderboardQuerySchema = jest.mocked(LeaderboardQuerySchema);
const mockedLeaderboardEntrySchema = jest.mocked(LeaderboardEntrySchema);
const mockedAsError = jest.mocked(asError);

describe('leaderboard routes', () => {
  let app: ReturnType<typeof express> | undefined;
  let server: Server | undefined;
  let baseUrl: string | undefined;

  beforeEach(async () => {
    jest.clearAllMocks();
    nock.cleanAll();

    app = express();
    app.use(express.json());
    app.use('/api/leaderboard', leaderboardRouter);
    setupErrorHandling(app);

    // Start server on a random port
    server = app.listen(0);
    const address = server.address();
    if (address === null) {
      throw new Error('Failed to get server address');
    }
    if (typeof address === 'string') {
      throw new Error(`Server address is a string: ${address}`);
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
    nock.cleanAll();
  });

  describe('gET /api/leaderboard', () => {
    test('should return leaderboard data with default parameters', async () => {
      const mockLeaderboardData = [
        {
          id: 1,
          username: 'user1',
          points: 100,
          streak_count: 5,
          badges_earned: 2,
          chores_completed: 10,
        },
        {
          id: 2,
          username: 'user2',
          points: 80,
          streak_count: 3,
          chores_completed: 8,
          badges_earned: 1,
        },
      ];

      const mockPreparedStatement = {
        all: jest.fn().mockReturnValue(mockLeaderboardData),
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedLeaderboardQuerySchema.parse.mockReturnValue({
        limit: 10,
        sortBy: 'points',
      });

      mockedLeaderboardRowSchema.parse
        .mockReturnValueOnce(mockLeaderboardData[0]!)
        .mockReturnValueOnce(mockLeaderboardData[1]!);

      mockedLeaderboardEntrySchema.parse
        .mockReturnValueOnce({rank: 1, ...mockLeaderboardData[0]!})
        .mockReturnValueOnce({rank: 2, ...mockLeaderboardData[1]!});

      const response = await fetch(`${baseUrl!}/api/leaderboard`);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({
        success: true,
        data: {
          leaderboard: [
            {rank: 1, ...mockLeaderboardData[0]},
            {rank: 2, ...mockLeaderboardData[1]},
          ],
          sortBy: 'points',
          totalUsers: 2,
        },
      });

      expect(mockPreparedStatement.all).toHaveBeenCalledWith(10);
      expect(mockLogger.info).toHaveBeenCalledWith(
        {sortBy: 'points', limit: 10, totalUsers: 2},
        'Leaderboard retrieved',
      );
    });

    test('should return leaderboard sorted by streak', async () => {
      const mockLeaderboardData = [
        {
          id: 1,
          username: 'user1',
          points: 80,
          streak_count: 10,
          badges_earned: 1,
          chores_completed: 8,
        },
      ];

      const mockPreparedStatement = {
        all: jest.fn().mockReturnValue(mockLeaderboardData),
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedLeaderboardQuerySchema.parse.mockReturnValue({
        limit: 5,
        sortBy: 'streak',
      });

      mockedLeaderboardRowSchema.parse.mockReturnValueOnce(
        mockLeaderboardData[0]!,
      );
      mockedLeaderboardEntrySchema.parse.mockReturnValueOnce({
        rank: 1,
        ...mockLeaderboardData[0]!,
      });

      const response = await fetch(
        `${baseUrl!}/api/leaderboard?sortBy=streak&limit=5`,
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data.sortBy).toBe('streak');

      expect(mockPreparedStatement.all).toHaveBeenCalledWith(5);
    });

    test('should handle empty leaderboard', async () => {
      const mockPreparedStatement = {
        all: jest.fn().mockReturnValue([]),
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedLeaderboardQuerySchema.parse.mockReturnValue({
        limit: 10,
        sortBy: 'points',
      });

      const response = await fetch(`${baseUrl!}/api/leaderboard`);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({
        success: true,
        data: {leaderboard: [], sortBy: 'points', totalUsers: 0},
      });
    });

    test('should handle validation errors', async () => {
      // Import z to get real ZodError constructor
      const {z: zod} = await import('zod');
      mockedLeaderboardQuerySchema.parse.mockImplementation(() => {
        throw new zod.ZodError([
          {
            code: 'invalid_type',
            expected: 'number',
            path: ['limit'],
            message: 'Expected number, received string',
          },
        ]);
      });

      const response = await fetch(`${baseUrl!}/api/leaderboard?limit=invalid`);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Invalid request data');

      expect(mockLogger.error).toHaveBeenCalledWith(
        {
          error: new ZodError([
            {
              code: 'invalid_type',
              expected: 'number',
              path: ['limit'],
              message: 'Expected number, received string',
            },
          ]),
        },
        'Error',
      );
    });

    test('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      const mockPreparedStatement = {
        all: jest.fn().mockImplementation(() => {
          throw dbError;
        }),
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedLeaderboardQuerySchema.parse.mockReturnValue({
        limit: 10,
        sortBy: 'points',
      });

      mockedAsError.mockReturnValue(dbError);

      const response = await fetch(`${baseUrl!}/api/leaderboard`);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({
        success: false,
        error: 'Database connection failed',
      });

      expect(mockLogger.error).toHaveBeenCalledWith({error: dbError}, 'Error');
    });

    test('should handle schema parsing errors', async () => {
      const mockLeaderboardData = [
        {
          id: 1,
          username: 'user1',
          points: 100,
          streak_count: 5,
          badges_earned: 2,
          chores_completed: 10,
        },
      ];

      const mockPreparedStatement = {
        all: jest.fn().mockReturnValue(mockLeaderboardData),
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedLeaderboardQuerySchema.parse.mockReturnValue({
        limit: 10,
        sortBy: 'points',
      });

      const parseError = new Error('Schema parsing failed');
      mockedLeaderboardRowSchema.parse.mockImplementation(() => {
        throw parseError;
      });
      mockedAsError.mockReturnValue(parseError);

      const response = await fetch(`${baseUrl!}/api/leaderboard`);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body).toEqual({success: false, error: 'Schema parsing failed'});
    });
  });
});
