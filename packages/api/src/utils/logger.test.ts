import {
  describe,
  expect,
  test,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';

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
    process.env['LOG_LEVEL'] = 'debug';
    const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
    mockPino.mockReturnValue(mockLoggerInstance);

    await import('./logger');

    expect(mockPino).toHaveBeenCalledWith({level: 'debug'});
  });

  test('should add pretty transport in development', async () => {
    process.env['NODE_ENV'] = 'development';
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

  test('should not add transport in production', async () => {
    process.env['NODE_ENV'] = 'production';
    const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
    mockPino.mockReturnValue(mockLoggerInstance);

    await import('./logger');

    expect(mockPino).toHaveBeenCalledWith({level: 'info'});
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

  test('should export default logger instance', async () => {
    const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
    mockPino.mockReturnValue(mockLoggerInstance);

    const loggerModule = await import('./logger');

    expect(loggerModule.default).toBe(mockLoggerInstance);
  });
});
