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
  CreateGoalSchema,
  UpdateGoalSchema,
  GoalQuerySchema,
  GoalSchema,
  CountRowSchema,
  IdParamSchema,
} from '@gitterdun/shared';
import goalsRouter from './goals';
import db from '../lib/db';

// Mock dependencies
jest.mock('../lib/db', () => ({
  __esModule: true,
  default: {prepare: jest.fn()},
}));

jest.mock('@gitterdun/shared');

const mockDb = jest.mocked(db);
const mockedCreateGoalSchema = jest.mocked(CreateGoalSchema);
const mockedUpdateGoalSchema = jest.mocked(UpdateGoalSchema);
const mockedGoalQuerySchema = jest.mocked(GoalQuerySchema);
const mockedGoalSchema = jest.mocked(GoalSchema);
const mockedCountRowSchema = jest.mocked(CountRowSchema);
const mockedIdParamSchema = jest.mocked(IdParamSchema);

describe('goals routes', () => {
  let app: express.Application | undefined;
  let server: Server | undefined;
  let baseUrl: string | undefined;

  beforeEach(async () => {
    jest.clearAllMocks();
    nock.cleanAll();

    app = express();
    app.use(express.json());
    app.use('/api/goals', goalsRouter);

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

  describe('gET /api/goals', () => {
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
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedGoalQuerySchema.parse.mockReturnValue({
        user_id: 1,
        status: undefined,
        page: 1,
        limit: 20,
      });
      mockedCountRowSchema.parse.mockReturnValue({count: 1});
      mockedGoalSchema.parse.mockReturnValue(mockGoals[0]!);

      const response = await fetch(`${baseUrl!}/api/goals?user_id=1`);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({
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

      const response = await fetch(`${baseUrl!}/api/goals`);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({success: false, error: 'User ID is required'});
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
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedGoalQuerySchema.parse.mockReturnValue({
        user_id: 1,
        status: 'active',
        page: 1,
        limit: 20,
      });
      mockedCountRowSchema.parse.mockReturnValue({count: 1});
      mockedGoalSchema.parse.mockReturnValue(mockGoals[0]!);

      const response = await fetch(
        `${baseUrl!}/api/goals?user_id=1&status=active`,
      );

      expect(response.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/unbound-method -- not being called
      expect(mockPreparedStatement.all).toHaveBeenCalledWith(
        1,
        'active',
        20,
        0,
      );
    });

    test('should handle validation errors', async () => {
      // Import zod to get real ZodError constructor
      const {z: zod} = await import('zod');
      mockedGoalQuerySchema.parse.mockImplementation(() => {
        throw new zod.ZodError([
          {
            code: 'invalid_type',
            expected: 'string',
            path: ['invalid'],
            message: 'Required',
          },
        ]);
      });

      const response = await fetch(`${baseUrl!}/api/goals?invalid=param`);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Invalid query parameters');
    });
  });

  describe('pOST /api/goals', () => {
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
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedCreateGoalSchema.parse.mockReturnValue(newGoal);
      mockedGoalSchema.parse.mockReturnValue(createdGoal);

      const response = await fetch(`${baseUrl!}/api/goals`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newGoal),
      });
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual({
        success: true,
        data: createdGoal,
        message: 'Goal created successfully',
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method -- not being called
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

      const response = await fetch(`${baseUrl!}/api/goals`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(invalidGoal),
      });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({
        success: false,
        error: 'Target points must be greater than 0',
      });
    });

    test('should handle validation errors', async () => {
      // Import zod to get real ZodError constructor
      const {z: zod} = await import('zod');
      mockedCreateGoalSchema.parse.mockImplementation(() => {
        throw new zod.ZodError([
          {
            code: 'invalid_type',
            expected: 'string',
            path: ['title'],
            message: 'Required',
          },
        ]);
      });

      const response = await fetch(`${baseUrl!}/api/goals`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({}),
      });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Invalid request data');
    });
  });

  describe('gET /api/goals/:id', () => {
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

      const mockPreparedStatement = {
        get: jest.fn().mockReturnValue(mockGoal),
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedIdParamSchema.parse.mockReturnValue({id: 1});
      mockedGoalSchema.parse.mockReturnValue(mockGoal);

      const response = await fetch(`${baseUrl!}/api/goals/1`);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({success: true, data: mockGoal});
    });

    test('should return 404 for non-existent goal', async () => {
      const mockPreparedStatement = {
        get: jest.fn().mockReturnValue(undefined),
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockPreparedStatement);

      mockedIdParamSchema.parse.mockReturnValue({id: 999});

      const response = await fetch(`${baseUrl!}/api/goals/999`);
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({success: false, error: 'Goal not found'});
    });

    test('should return 400 for invalid goal ID', async () => {
      mockedIdParamSchema.parse.mockReturnValue({id: NaN});

      const response = await fetch(`${baseUrl!}/api/goals/invalid`);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({success: false, error: 'Invalid goal ID'});
    });
  });

  describe('pUT /api/goals/:id', () => {
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

      const mockCheckStatement = {
        get: jest.fn().mockReturnValue({id: 1}),
      } as unknown as Statement;
      const mockUpdateStatement = {
        get: jest.fn().mockReturnValue(updatedGoal),
      } as unknown as Statement;
      mockDb.prepare
        .mockReturnValueOnce(mockCheckStatement) // Check existence
        .mockReturnValueOnce(mockUpdateStatement); // Update

      mockedIdParamSchema.parse.mockReturnValue({id: 1});
      mockedUpdateGoalSchema.parse.mockReturnValue(updateData);
      mockedGoalSchema.parse.mockReturnValue(updatedGoal);

      const response = await fetch(`${baseUrl!}/api/goals/1`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updateData),
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({
        success: true,
        data: updatedGoal,
        message: 'Goal updated successfully',
      });
    });

    test('should return 404 for non-existent goal', async () => {
      const mockCheckStatement = {
        get: jest.fn().mockReturnValue(undefined),
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockCheckStatement);

      mockedIdParamSchema.parse.mockReturnValue({id: 999});
      mockedUpdateGoalSchema.parse.mockReturnValue({title: 'Test'});

      const response = await fetch(`${baseUrl!}/api/goals/999`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: 'Test'}),
      });
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({success: false, error: 'Goal not found'});
    });

    test('should return 400 when no fields to update', async () => {
      const mockCheckStatement = {
        get: jest.fn().mockReturnValue({id: 1}),
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockCheckStatement);

      mockedIdParamSchema.parse.mockReturnValue({id: 1});
      mockedUpdateGoalSchema.parse.mockReturnValue({});

      const response = await fetch(`${baseUrl!}/api/goals/1`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({}),
      });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({success: false, error: 'No fields to update'});
    });
  });

  describe('dELETE /api/goals/:id', () => {
    test('should delete goal successfully', async () => {
      const mockCheckStatement = {
        get: jest.fn().mockReturnValue({id: 1}),
      } as unknown as Statement;
      const mockDeleteStatement = {run: jest.fn()} as unknown as Statement;
      mockDb.prepare
        .mockReturnValueOnce(mockCheckStatement) // Check existence
        .mockReturnValueOnce(mockDeleteStatement); // Delete

      mockedIdParamSchema.parse.mockReturnValue({id: 1});

      const response = await fetch(`${baseUrl!}/api/goals/1`, {
        method: 'DELETE',
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({
        success: true,
        message: 'Goal deleted successfully',
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method -- not being called
      expect(mockDeleteStatement.run).toHaveBeenCalledWith(1);
    });

    test('should return 404 for non-existent goal', async () => {
      const mockCheckStatement = {
        get: jest.fn().mockReturnValue(undefined),
      } as unknown as Statement;
      mockDb.prepare.mockReturnValue(mockCheckStatement);

      mockedIdParamSchema.parse.mockReturnValue({id: 999});

      const response = await fetch(`${baseUrl!}/api/goals/999`, {
        method: 'DELETE',
      });
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({success: false, error: 'Goal not found'});
    });

    test('should return 400 for invalid goal ID', async () => {
      mockedIdParamSchema.parse.mockReturnValue({id: NaN});

      const response = await fetch(`${baseUrl!}/api/goals/invalid`, {
        method: 'DELETE',
      });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({success: false, error: 'Invalid goal ID'});
    });
  });
});
