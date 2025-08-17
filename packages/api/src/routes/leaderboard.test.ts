import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock dependencies
const mockDb = {prepare: jest.fn().mockReturnValue({all: jest.fn()})};
jest.mock('../lib/db', () => ({__esModule: true, default: mockDb}));

const mockLogger = {info: jest.fn(), error: jest.fn(), warn: jest.fn()};
jest.mock('../utils/logger', () => ({logger: mockLogger}));

jest.mock('@gitterdun/shared');
import {
  LeaderboardRowSchema,
  LeaderboardQuerySchema,
  LeaderboardEntrySchema,
  asError,
} from '@gitterdun/shared';

import leaderboardRouter from './leaderboard';

const mockedLeaderboardRowSchema = jest.mocked(LeaderboardRowSchema);
const mockedLeaderboardQuerySchema = jest.mocked(LeaderboardQuerySchema);
const mockedLeaderboardEntrySchema = jest.mocked(LeaderboardEntrySchema);
const mockedAsError = jest.mocked(asError);

describe('leaderboard routes', () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/api/leaderboard', leaderboardRouter);
  });

  describe('GET /api/leaderboard', () => {
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
      };
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedLeaderboardQuerySchema.parse.mockReturnValue({
        limit: 10,
        sortBy: 'points',
      });

      mockedLeaderboardRowSchema.parse
        .mockReturnValueOnce(mockLeaderboardData[0])
        .mockReturnValueOnce(mockLeaderboardData[1]);

      mockedLeaderboardEntrySchema.parse
        .mockReturnValueOnce({rank: 1, ...mockLeaderboardData[0]})
        .mockReturnValueOnce({rank: 2, ...mockLeaderboardData[1]});

      const response = await request(app).get('/api/leaderboard');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
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
      };
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedLeaderboardQuerySchema.parse.mockReturnValue({
        limit: 5,
        sortBy: 'streak',
      });

      mockedLeaderboardRowSchema.parse.mockReturnValueOnce(
        mockLeaderboardData[0],
      );
      mockedLeaderboardEntrySchema.parse.mockReturnValueOnce({
        rank: 1,
        ...mockLeaderboardData[0],
      });

      const response = await request(app).get(
        '/api/leaderboard?sortBy=streak&limit=5',
      );

      expect(response.status).toBe(200);
      expect(response.body.data.sortBy).toBe('streak');
      expect(mockPreparedStatement.all).toHaveBeenCalledWith(5);
    });

    test('should handle empty leaderboard', async () => {
      const mockPreparedStatement = {all: jest.fn().mockReturnValue([])};
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedLeaderboardQuerySchema.parse.mockReturnValue({
        limit: 10,
        sortBy: 'points',
      });

      const response = await request(app).get('/api/leaderboard');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {leaderboard: [], sortBy: 'points', totalUsers: 0},
      });
    });

    test('should handle validation errors', async () => {
      // Import z to get real ZodError constructor
      const {z} = await import('zod');
      mockedLeaderboardQuerySchema.parse.mockImplementation(() => {
        throw new z.ZodError([
          {
            code: 'invalid_type',
            expected: 'number',
            received: 'string',
            path: ['limit'],
            message: 'Expected number, received string',
          },
        ]);
      });

      const response = await request(app).get('/api/leaderboard?limit=invalid');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid query parameters');

      expect(mockLogger.warn).toHaveBeenCalled();
    });

    test('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      const mockPreparedStatement = {
        all: jest.fn().mockImplementation(() => {
          throw dbError;
        }),
      };
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedLeaderboardQuerySchema.parse.mockReturnValue({
        limit: 10,
        sortBy: 'points',
      });

      mockedAsError.mockReturnValue(dbError);

      const response = await request(app).get('/api/leaderboard');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
      });

      expect(mockLogger.error).toHaveBeenCalledWith(
        {error: dbError},
        'Get leaderboard error',
      );
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
      };
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

      const response = await request(app).get('/api/leaderboard');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Internal server error',
      });
    });
  });
});
