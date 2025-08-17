import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock dependencies
const mockDb = {
  prepare: jest
    .fn()
    .mockReturnValue({get: jest.fn(), all: jest.fn(), run: jest.fn()}),
};
jest.mock('../lib/db', () => ({__esModule: true, default: mockDb}));

const mockLogger = {info: jest.fn(), error: jest.fn(), warn: jest.fn()};
jest.mock('../utils/logger', () => ({logger: mockLogger}));

jest.mock('@gitterdun/shared');
import {
  CreateGoalSchema,
  UpdateGoalSchema,
  GoalQuerySchema,
  GoalSchema,
  CountRowSchema,
  asError,
  IdParamSchema,
} from '@gitterdun/shared';

import goalsRouter from './goals';

const mockedCreateGoalSchema = jest.mocked(CreateGoalSchema);
const mockedUpdateGoalSchema = jest.mocked(UpdateGoalSchema);
const mockedGoalQuerySchema = jest.mocked(GoalQuerySchema);
const mockedGoalSchema = jest.mocked(GoalSchema);
const mockedCountRowSchema = jest.mocked(CountRowSchema);
const mockedAsError = jest.mocked(asError);
const mockedIdParamSchema = jest.mocked(IdParamSchema);

describe('goals routes', () => {
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/api/goals', goalsRouter);
  });

  describe('GET /api/goals', () => {
    test('should return paginated goals for user', async () => {
      const mockGoals = [
        {
          id: 1,
          user_id: 1,
          title: 'Goal 1',
          description: 'Test goal',
          target_points: 100,
          current_points: 50,
          status: 'active',
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        },
      ];

      const mockPreparedStatement = {
        get: jest.fn().mockReturnValue({total: 1}),
        all: jest.fn().mockReturnValue(mockGoals),
      };
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedGoalQuerySchema.parse.mockReturnValue({
        user_id: 1,
        status: undefined,
        page: 1,
        limit: 20,
      });
      mockedCountRowSchema.parse.mockReturnValue({count: 1});
      mockedGoalSchema.parse.mockReturnValue(mockGoals[0]);

      const response = await request(app).get('/api/goals?user_id=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: [mockGoals[0]],
        pagination: {page: 1, limit: 20, total: 1, totalPages: 1},
      });
    });

    test('should return 400 when user_id is missing', async () => {
      mockedGoalQuerySchema.parse.mockReturnValue({
        user_id: undefined,
        status: undefined,
        page: 1,
        limit: 20,
      });

      const response = await request(app).get('/api/goals');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'User ID is required',
      });
    });

    test('should filter goals by status', async () => {
      const mockGoals = [
        {
          id: 1,
          user_id: 1,
          title: 'Active Goal',
          status: 'active',
          target_points: 100,
          current_points: 0,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z',
        },
      ];

      const mockPreparedStatement = {
        get: jest.fn().mockReturnValue({total: 1}),
        all: jest.fn().mockReturnValue(mockGoals),
      };
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedGoalQuerySchema.parse.mockReturnValue({
        user_id: 1,
        status: 'active',
        page: 1,
        limit: 20,
      });
      mockedCountRowSchema.parse.mockReturnValue({count: 1});
      mockedGoalSchema.parse.mockReturnValue(mockGoals[0]);

      const response = await request(app).get(
        '/api/goals?user_id=1&status=active',
      );

      expect(response.status).toBe(200);
      expect(mockPreparedStatement.all).toHaveBeenCalledWith(
        1,
        'active',
        20,
        0,
      );
    });

    test('should handle validation errors', async () => {
      // Import z to get real ZodError constructor
      const {z} = await import('zod');
      mockedGoalQuerySchema.parse.mockImplementation(() => {
        throw new z.ZodError([
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['invalid'],
            message: 'Required',
          },
        ]);
      });

      const response = await request(app).get('/api/goals?invalid=param');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid query parameters');
    });
  });

  describe('POST /api/goals', () => {
    test('should create a new goal successfully', async () => {
      const newGoal = {
        title: 'New Goal',
        description: 'Test goal',
        target_points: 100,
      };

      const createdGoal = {
        id: 1,
        user_id: 1,
        ...newGoal,
        current_points: 0,
        status: 'active',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      const mockPreparedStatement = {
        get: jest.fn().mockReturnValue(createdGoal),
      };
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedCreateGoalSchema.parse.mockReturnValue(newGoal);
      mockedGoalSchema.parse.mockReturnValue(createdGoal);

      const response = await request(app).post('/api/goals').send(newGoal);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        data: createdGoal,
        message: 'Goal created successfully',
      });

      expect(mockPreparedStatement.get).toHaveBeenCalledWith(
        'New Goal',
        'Test goal',
        100,
        0,
        1,
      );
    });

    test('should return 400 for zero target points', async () => {
      const invalidGoal = {title: 'Invalid Goal', target_points: 0};

      mockedCreateGoalSchema.parse.mockReturnValue(invalidGoal);

      const response = await request(app).post('/api/goals').send(invalidGoal);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Target points must be greater than 0',
      });
    });

    test('should handle validation errors', async () => {
      // Import z to get real ZodError constructor
      const {z} = await import('zod');
      mockedCreateGoalSchema.parse.mockImplementation(() => {
        throw new z.ZodError([
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['title'],
            message: 'Required',
          },
        ]);
      });

      const response = await request(app).post('/api/goals').send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid request data');
    });
  });

  describe('GET /api/goals/:id', () => {
    test('should return specific goal', async () => {
      const mockGoal = {
        id: 1,
        user_id: 1,
        title: 'Test Goal',
        target_points: 100,
        current_points: 25,
        status: 'active',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      };

      const mockPreparedStatement = {get: jest.fn().mockReturnValue(mockGoal)};
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedIdParamSchema.parse.mockReturnValue({id: 1});
      mockedGoalSchema.parse.mockReturnValue(mockGoal);

      const response = await request(app).get('/api/goals/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({success: true, data: mockGoal});
    });

    test('should return 404 for non-existent goal', async () => {
      const mockPreparedStatement = {get: jest.fn().mockReturnValue(undefined)};
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedIdParamSchema.parse.mockReturnValue({id: 999});

      const response = await request(app).get('/api/goals/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({success: false, error: 'Goal not found'});
    });

    test('should return 400 for invalid goal ID', async () => {
      mockedIdParamSchema.parse.mockReturnValue({id: NaN});

      const response = await request(app).get('/api/goals/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({success: false, error: 'Invalid goal ID'});
    });
  });

  describe('PUT /api/goals/:id', () => {
    test('should update goal successfully', async () => {
      const updateData = {title: 'Updated Goal', target_points: 150};

      const updatedGoal = {
        id: 1,
        user_id: 1,
        title: 'Updated Goal',
        target_points: 150,
        current_points: 25,
        status: 'active',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T12:00:00.000Z',
      };

      const mockCheckStatement = {get: jest.fn().mockReturnValue({id: 1})};
      const mockUpdateStatement = {get: jest.fn().mockReturnValue(updatedGoal)};
      mockDb.prepare
        .mockReturnValueOnce(mockCheckStatement) // Check existence
        .mockReturnValueOnce(mockUpdateStatement); // Update

      mockedIdParamSchema.parse.mockReturnValue({id: 1});
      mockedUpdateGoalSchema.parse.mockReturnValue(updateData);
      mockedGoalSchema.parse.mockReturnValue(updatedGoal);

      const response = await request(app).put('/api/goals/1').send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: updatedGoal,
        message: 'Goal updated successfully',
      });
    });

    test('should return 404 for non-existent goal', async () => {
      const mockCheckStatement = {get: jest.fn().mockReturnValue(undefined)};
      mockDb.prepare.mockReturnValue(mockCheckStatement);

      mockedIdParamSchema.parse.mockReturnValue({id: 999});
      mockedUpdateGoalSchema.parse.mockReturnValue({title: 'Test'});

      const response = await request(app)
        .put('/api/goals/999')
        .send({title: 'Test'});

      expect(response.status).toBe(404);
      expect(response.body).toEqual({success: false, error: 'Goal not found'});
    });

    test('should return 400 when no fields to update', async () => {
      const mockCheckStatement = {get: jest.fn().mockReturnValue({id: 1})};
      mockDb.prepare.mockReturnValue(mockCheckStatement);

      mockedIdParamSchema.parse.mockReturnValue({id: 1});
      mockedUpdateGoalSchema.parse.mockReturnValue({});

      const response = await request(app).put('/api/goals/1').send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'No fields to update',
      });
    });
  });

  describe('DELETE /api/goals/:id', () => {
    test('should delete goal successfully', async () => {
      const mockCheckStatement = {get: jest.fn().mockReturnValue({id: 1})};
      const mockDeleteStatement = {run: jest.fn()};
      mockDb.prepare
        .mockReturnValueOnce(mockCheckStatement) // Check existence
        .mockReturnValueOnce(mockDeleteStatement); // Delete

      mockedIdParamSchema.parse.mockReturnValue({id: 1});

      const response = await request(app).delete('/api/goals/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Goal deleted successfully',
      });

      expect(mockDeleteStatement.run).toHaveBeenCalledWith(1);
    });

    test('should return 404 for non-existent goal', async () => {
      const mockCheckStatement = {get: jest.fn().mockReturnValue(undefined)};
      mockDb.prepare.mockReturnValue(mockCheckStatement);

      mockedIdParamSchema.parse.mockReturnValue({id: 999});

      const response = await request(app).delete('/api/goals/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({success: false, error: 'Goal not found'});
    });

    test('should return 400 for invalid goal ID', async () => {
      mockedIdParamSchema.parse.mockReturnValue({id: NaN});

      const response = await request(app).delete('/api/goals/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({success: false, error: 'Invalid goal ID'});
    });
  });
});
