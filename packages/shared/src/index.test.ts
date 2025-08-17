import {describe, expect, test} from '@jest/globals';

// Import everything from the index file
import * as indexExports from './index';

// Import directly from source files for comparison
import {
  UserSchema,
  CreateUserSchema,
  FamilySchema,
  ApiResponseSchema,
} from './schemas';
import {asError} from './utils/asError';

describe('index.ts barrel exports', () => {
  describe('schema exports', () => {
    test('should export UserSchema correctly', () => {
      expect(indexExports.UserSchema).toBeDefined();
      expect(indexExports.UserSchema).toBe(UserSchema);

      // Test that it works as expected
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

      const result = indexExports.UserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    test('should export CreateUserSchema correctly', () => {
      expect(indexExports.CreateUserSchema).toBeDefined();
      expect(indexExports.CreateUserSchema).toBe(CreateUserSchema);

      // Test that it works as expected
      const validCreateUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        role: 'user' as const,
      };

      const result = indexExports.CreateUserSchema.safeParse(validCreateUser);
      expect(result.success).toBe(true);
    });

    test('should export FamilySchema correctly', () => {
      expect(indexExports.FamilySchema).toBeDefined();
      expect(indexExports.FamilySchema).toBe(FamilySchema);

      // Test that it works as expected
      const validFamily = {
        id: 1,
        name: 'Test Family',
        owner_id: 1,
        created_at: '2024-01-01 10:00:00',
      };

      const result = indexExports.FamilySchema.safeParse(validFamily);
      expect(result.success).toBe(true);
    });

    test('should export ApiResponseSchema function correctly', () => {
      expect(indexExports.ApiResponseSchema).toBeDefined();
      expect(indexExports.ApiResponseSchema).toBe(ApiResponseSchema);
      expect(typeof indexExports.ApiResponseSchema).toBe('function');
    });

    test('should create working schemas with ApiResponseSchema', () => {
      // Test that the exported function works as expected
      // eslint-disable-next-line new-cap -- ApiResponseSchema is a factory function, not a constructor
      const userResponseSchema = indexExports.ApiResponseSchema(
        indexExports.UserSchema,
      );
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
  });

  describe('type exports', () => {
    test('should allow using exported types', () => {
      // Test that types are available (this is compile-time, but we can verify at runtime)
      const user: indexExports.User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        points: 100,
        streak_count: 5,
        created_at: '2024-01-01 10:00:00',
        updated_at: '2024-01-01 10:00:00',
      };

      expect(user.id).toBe(1);
      expect(user.username).toBe('testuser');
    });

    test('should allow using CreateUser type', () => {
      const createUser: indexExports.CreateUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        role: 'user',
      };

      expect(createUser.username).toBe('newuser');
      expect(createUser.password).toBe('password123');
    });

    test('should allow using Family type', () => {
      const family: indexExports.Family = {
        id: 1,
        name: 'Test Family',
        owner_id: 1,
        created_at: '2024-01-01 10:00:00',
      };

      expect(family.name).toBe('Test Family');
      expect(family.owner_id).toBe(1);
    });
  });

  describe('utility function exports', () => {
    test('should export asError function correctly', () => {
      expect(indexExports.asError).toBeDefined();
      expect(indexExports.asError).toBe(asError);
      expect(typeof indexExports.asError).toBe('function');
    });

    test('should handle non-Error values correctly through exported asError', () => {
      // Test that it works as expected
      const result = indexExports.asError('test error');
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Non-Error thrown: test error');
      expect(result.value).toBe('test error');
    });

    test('should handle Error objects correctly through exported function', () => {
      const originalError = new Error('Original error');
      const result = indexExports.asError(originalError);

      expect(result).toBe(originalError);
      expect(result.message).toBe('Original error');
    });
  });

  describe('export completeness', () => {
    test('should have UserSchema and CreateUserSchema available', () => {
      expect(indexExports).toHaveProperty('UserSchema');
      expect(indexExports.UserSchema).toBeDefined();
      expect(indexExports).toHaveProperty('CreateUserSchema');
      expect(indexExports.CreateUserSchema).toBeDefined();
    });

    test('should have FamilySchema and ChoreSchema available', () => {
      expect(indexExports).toHaveProperty('FamilySchema');
      expect(indexExports.FamilySchema).toBeDefined();
      expect(indexExports).toHaveProperty('ChoreSchema');
      expect(indexExports.ChoreSchema).toBeDefined();
    });

    test('should have GoalSchema and ApiResponseSchema available', () => {
      expect(indexExports).toHaveProperty('GoalSchema');
      expect(indexExports.GoalSchema).toBeDefined();
      expect(indexExports).toHaveProperty('ApiResponseSchema');
      expect(indexExports.ApiResponseSchema).toBeDefined();
    });

    test('should have schemas for corresponding TypeScript types', () => {
      // These are compile-time checks, but we can verify the schemas exist
      // which indicates the types should be available
      expect(indexExports).toHaveProperty('UserSchema');
      expect(indexExports).toHaveProperty('CreateUserSchema');
      expect(indexExports).toHaveProperty('FamilySchema');
      expect(indexExports).toHaveProperty('ChoreSchema');
      expect(indexExports).toHaveProperty('GoalSchema');
    });

    test('should have utility function exports available', () => {
      expect(indexExports).toHaveProperty('asError');
      expect(typeof indexExports.asError).toBe('function');
    });
  });

  describe('re-export consistency', () => {
    test('should re-export UserSchema and CreateUserSchema identically', () => {
      expect(indexExports.UserSchema).toBe(UserSchema);
      expect(indexExports.CreateUserSchema).toBe(CreateUserSchema);
    });

    test('should re-export FamilySchema and ApiResponseSchema identically', () => {
      expect(indexExports.FamilySchema).toBe(FamilySchema);
      expect(indexExports.ApiResponseSchema).toBe(ApiResponseSchema);
    });

    test('should re-export utilities identically to direct imports', () => {
      expect(indexExports.asError).toBe(asError);
    });
  });
});
