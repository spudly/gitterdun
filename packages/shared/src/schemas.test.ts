import {describe, expect, test} from '@jest/globals';
import {
  UserSchema,
  CreateUserSchema,
  LoginSchema,
  FamilySchema,
  ChoreSchema,
  CreateChoreSchema,
  UpdateChoreSchema,
  GoalSchema,
  NotificationSchema,
  PaginationSchema,
  ApiResponseSchema,
  PaginatedResponseSchema,
  IdParamSchema,
  CompleteChoreBodySchema,
  LeaderboardQuerySchema,
  RoleRowSchema,
} from './schemas';

describe('user schemas', () => {
  test('userSchema should validate valid data', () => {
    const validUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'user' as const,
      points: 100,
      streak_count: 5,
      created_at: '2024-01-01 10:00:00',
      updated_at: '2024-01-01 10:00:00',
    };

    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  test('userSchema should reject invalid email', () => {
    const invalidUser = {
      id: 1,
      username: 'testuser',
      email: 'invalid-email',
      role: 'user' as const,
      points: 100,
      streak_count: 5,
      created_at: '2024-01-01 10:00:00',
      updated_at: '2024-01-01 10:00:00',
    };

    const result = UserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  test('createUserSchema should apply default role', () => {
    const validCreateUser = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
    };

    const result = CreateUserSchema.safeParse(validCreateUser);
    expect(result.success).toBe(true);
  });

  test('createUserSchema should reject short password', () => {
    const invalidCreateUser = {
      username: 'newuser',
      email: 'new@example.com',
      password: '123',
    };

    const result = CreateUserSchema.safeParse(invalidCreateUser);
    expect(result.success).toBe(false);
  });

  test('loginSchema should validate login data', () => {
    const validLogin = {email: 'user@example.com', password: 'password123'};

    const result = LoginSchema.safeParse(validLogin);
    expect(result.success).toBe(true);
  });
});

describe('chore schemas', () => {
  test('choreSchema should validate valid chore', () => {
    const validChore = {
      id: 1,
      title: 'Take out trash',
      point_reward: 10,
      bonus_points: 0,
      penalty_points: 0,
      chore_type: 'required',
      status: 'pending',
      created_by: 1,
      created_at: '2024-01-01T10:00:00.000Z',
      updated_at: '2024-01-01T10:00:00.000Z',
    };

    const result = ChoreSchema.safeParse(validChore);
    expect(result.success).toBe(true);
  });

  test('choreSchema should reject invalid chore_type', () => {
    const invalidChore = {
      id: 1,
      title: 'Take out trash',
      point_reward: 10,
      bonus_points: 0,
      penalty_points: 0,
      chore_type: 'invalid-type',
      status: 'pending',
      created_by: 1,
      created_at: '2024-01-01T10:00:00.000Z',
      updated_at: '2024-01-01T10:00:00.000Z',
    };

    const result = ChoreSchema.safeParse(invalidChore);
    expect(result.success).toBe(false);
  });

  test('choreSchema should reject invalid status', () => {
    const invalidChore = {
      id: 1,
      title: 'Take out trash',
      point_reward: 10,
      bonus_points: 0,
      penalty_points: 0,
      chore_type: 'required',
      status: 'invalid-status',
      created_by: 1,
      created_at: '2024-01-01T10:00:00.000Z',
      updated_at: '2024-01-01T10:00:00.000Z',
    };

    const result = ChoreSchema.safeParse(invalidChore);
    expect(result.success).toBe(false);
  });

  test('createChoreSchema should apply defaults', () => {
    const validCreateChore = {title: 'New chore', point_reward: 10};

    const result = CreateChoreSchema.safeParse(validCreateChore);
    expect(result.success).toBe(true);
  });

  test('createChoreSchema should reject invalid chore_type', () => {
    const invalidCreateChore = {
      title: 'Invalid chore',
      point_reward: 10,
      chore_type: 'invalid',
    };

    const result = CreateChoreSchema.safeParse(invalidCreateChore);
    expect(result.success).toBe(false);
  });

  test('updateChoreSchema should validate partial updates', () => {
    const validUpdate = {title: 'Updated title', point_reward: 15};

    const result = UpdateChoreSchema.safeParse(validUpdate);
    expect(result.success).toBe(true);
  });

  test('updateChoreSchema should reject invalid status', () => {
    const invalidUpdate = {status: 'invalid-status'};

    const result = UpdateChoreSchema.safeParse(invalidUpdate);
    expect(result.success).toBe(false);
  });

  test('updateChoreSchema should reject invalid chore_type', () => {
    const invalidUpdate = {chore_type: 'invalid-type'};

    const result = UpdateChoreSchema.safeParse(invalidUpdate);
    expect(result.success).toBe(false);
  });
});

describe('goal schemas', () => {
  test('goalSchema should validate valid goal', () => {
    const validGoal = {
      id: 1,
      user_id: 1,
      title: 'Earn 100 points',
      target_points: 100,
      current_points: 0,
      status: 'active',
      created_at: '2024-01-01T10:00:00.000Z',
      updated_at: '2024-01-01T10:00:00.000Z',
    };

    const result = GoalSchema.safeParse(validGoal);
    expect(result.success).toBe(true);
  });

  test('goalSchema should reject invalid status', () => {
    const invalidGoal = {
      id: 1,
      user_id: 1,
      title: 'Earn 100 points',
      target_points: 100,
      status: 'invalid-status',
      created_at: '2024-01-01T10:00:00.000Z',
      updated_at: '2024-01-01T10:00:00.000Z',
    };

    const result = GoalSchema.safeParse(invalidGoal);
    expect(result.success).toBe(false);
  });
});

describe('utility schemas', () => {
  test('paginationSchema should apply defaults', () => {
    const result = PaginationSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  test('paginationSchema should coerce string numbers', () => {
    const result = PaginationSchema.safeParse({page: '2', limit: '10'});
    expect(result.success).toBe(true);
  });

  test('idParamSchema should coerce string id', () => {
    const result = IdParamSchema.safeParse({id: '123'});
    expect(result.success).toBe(true);
  });

  test('completeChoreBodySchema should validate completion data', () => {
    const validData = {userId: 1, notes: 'Completed successfully'};

    const result = CompleteChoreBodySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test('leaderboardQuerySchema should apply defaults', () => {
    const result = LeaderboardQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  test('roleRowSchema should validate parent role', () => {
    const result = RoleRowSchema.safeParse({role: 'parent'});
    expect(result.success).toBe(true);
  });

  test('roleRowSchema should reject invalid role', () => {
    const result = RoleRowSchema.safeParse({role: 'invalid'});
    expect(result.success).toBe(false);
  });
});

describe('response schemas', () => {
  test('apiResponseSchema should create success response schema', () => {
     
    const userResponseSchema = ApiResponseSchema(UserSchema);
    const validResponse = {
      success: true,
      data: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user' as const,
        points: 100,
        streak_count: 5,
        created_at: '2024-01-01 10:00:00',
        updated_at: '2024-01-01 10:00:00',
      },
    };

    const result = userResponseSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  test('apiResponseSchema should create error response schema', () => {
     
    const userResponseSchema = ApiResponseSchema(UserSchema);
    const errorResponse = {success: false, error: 'User not found'};

    const result = userResponseSchema.safeParse(errorResponse);
    expect(result.success).toBe(true);
  });

  test('paginatedResponseSchema should create paginated schema', () => {
     
    const paginatedUsersSchema = PaginatedResponseSchema(UserSchema);
    const validResponse = {
      success: true,
      data: [
        {
          id: 1,
          username: 'user1',
          email: 'user1@example.com',
          role: 'user' as const,
          points: 100,
          streak_count: 5,
          created_at: '2024-01-01 10:00:00',
          updated_at: '2024-01-01 10:00:00',
        },
      ],
      pagination: {page: 1, limit: 20, total: 1, totalPages: 1},
    };

    const result = paginatedUsersSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });
});

describe('notification schema', () => {
  test('notificationSchema should validate notification', () => {
    const validNotification = {
      id: 1,
      user_id: 1,
      title: 'Chore Due',
      message: 'Your chore is due soon',
      type: 'chore_due' as const,
      created_at: '2024-01-01T10:00:00.000Z',
    };

    const result = NotificationSchema.safeParse(validNotification);
    expect(result.success).toBe(true);
  });

  test('notificationSchema should validate all notification types', () => {
    const types = [
      'chore_due',
      'chore_completed',
      'chore_approved',
      'overdue',
      'streak',
      'badge',
      'reward',
    ] as const;

    for (const type of types) {
      const notification = {
        id: 1,
        user_id: 1,
        title: 'Test',
        message: 'Test message',
        type,
        created_at: '2024-01-01T10:00:00.000Z',
      };

      const result = NotificationSchema.safeParse(notification);
      expect(result.success).toBe(true);
    }
  });
});

describe('family schema', () => {
  test('familySchema should validate family data', () => {
    const validFamily = {
      id: 1,
      name: 'Test Family',
      owner_id: 1,
      created_at: '2024-01-01 10:00:00',
    };

    const result = FamilySchema.safeParse(validFamily);
    expect(result.success).toBe(true);
  });

  test('familySchema should reject empty name', () => {
    const invalidFamily = {
      id: 1,
      name: '',
      owner_id: 1,
      created_at: '2024-01-01 10:00:00',
    };

    const result = FamilySchema.safeParse(invalidFamily);
    expect(result.success).toBe(false);
  });
});

// token search params schema moved to web package
