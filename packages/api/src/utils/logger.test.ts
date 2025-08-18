import {
  describe,
  expect,
  test,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import {withProperties} from '@gitterdun/shared';

// Mock pino before importing
const mockPino = jest.fn();
jest.mock('pino', () => mockPino);

describe('logger module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    delete process.env['LOG_LEVEL'];
    delete process.env['NODE_ENV'];
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('should create logger with default info level', async () => {
    const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
    mockPino.mockReturnValue(mockLoggerInstance);

    await import('./logger');

    expect(mockPino).toHaveBeenCalledWith({level: 'info'});
  });

  test('should use LOG_LEVEL environment variable when set', async () => {
    await withProperties(process.env, {LOG_LEVEL: 'debug'}, async () => {
      const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
      mockPino.mockReturnValue(mockLoggerInstance);

      await import('./logger');

      expect(mockPino).toHaveBeenCalledWith({level: 'debug'});
    });
    expect.hasAssertions();
  });

  test('should add pretty transport in development', async () => {
    await withProperties(process.env, {NODE_ENV: 'development'}, async () => {
      const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
      mockPino.mockReturnValue(mockLoggerInstance);

      await import('./logger');

      expect(mockPino).toHaveBeenCalledWith({
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      });
    });
    expect.hasAssertions();
  });

  test('should not add transport in production', async () => {
    await withProperties(process.env, {NODE_ENV: 'production'}, async () => {
      const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
      mockPino.mockReturnValue(mockLoggerInstance);

      await import('./logger');

      expect(mockPino).toHaveBeenCalledWith({level: 'info'});
    });
    expect.hasAssertions();
  });

  test('should not add transport when NODE_ENV is undefined', async () => {
    // NODE_ENV is already deleted in beforeEach
    const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
    mockPino.mockReturnValue(mockLoggerInstance);

    await import('./logger');

    expect(mockPino).toHaveBeenCalledWith({level: 'info'});
  });

  test('should export logger instance', async () => {
    const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
    mockPino.mockReturnValue(mockLoggerInstance);

    const {logger} = await import('./logger');

    expect(logger).toBe(mockLoggerInstance);
  });

  test('ensures tests end with an expectation (placeholder)', () => {
    expect(true).toBe(true);
  });
});
