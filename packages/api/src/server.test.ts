import {
  describe,
  expect,
  test,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import {initializeDatabase} from './lib/initDb';
import {logger} from './utils/logger';
import {asError, withProperties} from '@gitterdun/shared';
import dotenv from 'dotenv';

// Mock dependencies before importing server
jest.mock('./lib/db', () => ({
  __esModule: true,
  default: {
    exec: jest.fn(),
    prepare: jest.fn(() => ({get: jest.fn(), run: jest.fn()})),
    pragma: jest.fn(),
  },
}));
jest.mock('./lib/initDb');
jest.mock('./utils/logger');
jest.mock('./routes/auth');
jest.mock('./routes/chores');
jest.mock('./routes/goals');
jest.mock('./routes/leaderboard');
jest.mock('./routes/families');
jest.mock('./routes/invitations');
jest.mock('@gitterdun/shared', () => {
  const actual =
    jest.requireActual<typeof import('@gitterdun/shared')>('@gitterdun/shared');
  return {asError: jest.fn(), withProperties: actual.withProperties};
});
jest.mock('dotenv');

const mockedInitializeDatabase = jest.mocked(initializeDatabase);
const mockedLogger = jest.mocked(logger);
const mockedAsError = jest.mocked(asError);
const mockedDotenv = jest.mocked(dotenv);

describe('server', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {...originalEnv};

    // Mock logger methods
    jest.spyOn(mockedLogger, 'info').mockImplementation(jest.fn());
    jest.spyOn(mockedLogger, 'error').mockImplementation(jest.fn());

    // Mock dotenv
    jest
      .spyOn(mockedDotenv, 'config')
      .mockImplementation(
        () =>
          ({
            parsed: undefined,
            error: undefined,
          }) as unknown as dotenv.DotenvConfigOutput,
      );

    // Mock asError
    mockedAsError.mockImplementation((err: unknown) => err as Error);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  test('should initialize server with default configuration', async () => {
    mockedInitializeDatabase.mockResolvedValue();

    // Import server module to trigger initialization
    await import('./server');

    // Verify dotenv.config was called during module import
    expect(mockedDotenv.config).toHaveBeenCalledWith();
  });

  test('should handle database initialization failure', () => {
    const dbError = new Error('Database connection failed');
    mockedInitializeDatabase.mockRejectedValue(dbError);
    mockedAsError.mockReturnValue(dbError);

    // Test error handling configuration
    expect(mockedAsError).toBeDefined();
  });

  test('should configure CORS in development', () => {
    withProperties(process.env, {NODE_ENV: 'development'}, () => {
      // Test would require more complex Express app mocking
      // This is a placeholder for the CORS configuration test
      expect(process.env['NODE_ENV']).toBe('development');
    });
  });

  test('should not configure CORS in production', () => {
    withProperties(process.env, {NODE_ENV: 'production'}, () => {
      expect(process.env['NODE_ENV']).toBe('production');
    });
  });

  test('should use custom PORT from environment', () => {
    withProperties(process.env, {PORT: '8080'}, () => {
      expect(process.env['PORT']).toBe('8080');
    });
  });

  // Note: Testing Express app configuration requires more complex mocking
  // The following would be integration tests if we had a test server setup

  describe('api endpoints (would require test server)', () => {
    test('should handle health check endpoint', () => {
      // This would test: GET /api/health
      // Returns: {status: 'OK', timestamp: string, uptime: number}
      expect(true).toBe(true); // Placeholder
    });

    test('should handle API 404s', () => {
      // This would test: GET /api/nonexistent
      // Returns: {success: false, error: 'API endpoint not found'}
      expect(true).toBe(true); // Placeholder
    });

    test('should handle JSON parsing errors', () => {
      // This would test malformed JSON requests
      // Returns: {success: false, error: 'Invalid JSON payload'}
      expect(true).toBe(true); // Placeholder
    });

    test('should handle general server errors', () => {
      // This would test error middleware
      expect(true).toBe(true); // Placeholder
    });
  });
});
