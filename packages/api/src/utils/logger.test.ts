import {
  describe,
  expect,
  test,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';

// Local minimal withProperties helper for env mutations
const withProperties = async (
  obj: Record<string, unknown>,
  props: Record<string, unknown>,
  fn: () => Promise<void> | void,
): Promise<void> => {
  const original: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    original[key] = obj[key];
  }
  Object.assign(obj, props);
  try {
    await fn();
  } finally {
    Object.assign(obj, original);
  }
};

// Mock pino before importing
const mockPino = jest.fn();
jest.mock('pino', () => mockPino);

describe('logger module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    delete process.env['LOG_LEVEL'];
    delete process.env['NODE_ENV'];
    delete process.env['TEST_ENV'];
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('should create logger with default info level', async () => {
    const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
    mockPino.mockReturnValue(mockLoggerInstance);

    await import('./logger.js');

    expect(mockPino).toHaveBeenCalledWith(
      expect.objectContaining({level: 'info'}),
    );
  });

  test('should use LOG_LEVEL environment variable when set', async () => {
    await withProperties(process.env, {LOG_LEVEL: 'debug'}, async () => {
      const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
      mockPino.mockReturnValue(mockLoggerInstance);

      await import('./logger.js');

      expect(mockPino).toHaveBeenCalledWith(
        expect.objectContaining({level: 'debug'}),
      );
    });
    expect.hasAssertions();
  });

  test.each(['development', 'test'])(
    'should add pretty transport when NODE_ENV is %s',
    async nodeEnv => {
      await withProperties(process.env, {NODE_ENV: nodeEnv}, async () => {
        const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
        mockPino.mockReturnValue(mockLoggerInstance);

        await import('./logger.js');

        expect(mockPino).toHaveBeenCalledWith(
          expect.objectContaining({
            level: 'info',
            transport: expect.objectContaining({target: 'pino-pretty'}),
          }),
        );
      });
      expect.hasAssertions();
    },
  );

  test('should not add transport in production', async () => {
    await withProperties(process.env, {NODE_ENV: 'production'}, async () => {
      const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
      mockPino.mockReturnValue(mockLoggerInstance);

      await import('./logger.js');

      expect(mockPino).toHaveBeenCalledWith(
        expect.objectContaining({level: 'info'}),
      );
    });
    expect.hasAssertions();
  });

  test('should add transport when NODE_ENV is undefined (non-production)', async () => {
    // NODE_ENV is already deleted in beforeEach
    const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
    mockPino.mockReturnValue(mockLoggerInstance);

    await import('./logger.js');

    expect(mockPino).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'info',
        transport: expect.objectContaining({target: 'pino-pretty'}),
      }),
    );
  });

  test('should export logger instance', async () => {
    const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
    mockPino.mockReturnValue(mockLoggerInstance);

    const {logger} = await import('./logger.js');

    expect(logger).toBe(mockLoggerInstance);
  });

  test('uses silent level when TEST_ENV=jest', async () => {
    await withProperties(
      process.env,
      {NODE_ENV: 'test', TEST_ENV: 'jest'},
      async () => {
        const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
        mockPino.mockReturnValue(mockLoggerInstance);

        await import('./logger.js');

        expect(mockPino).toHaveBeenCalledWith(
          expect.objectContaining({level: 'silent'}),
        );
      },
    );
    expect.hasAssertions();
  });

  test('does not use silent level under Playwright tests env (NODE_ENV=test only)', async () => {
    await withProperties(process.env, {NODE_ENV: 'test'}, async () => {
      const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
      mockPino.mockReturnValue(mockLoggerInstance);

      await import('./logger.js');

      expect(mockPino).toHaveBeenCalledWith(
        expect.objectContaining({level: 'info'}),
      );
    });
    expect.hasAssertions();
  });

  test('pretty transport uses concise translateTime', async () => {
    await withProperties(process.env, {NODE_ENV: 'development'}, async () => {
      const mockLoggerInstance = {info: jest.fn(), error: jest.fn()};
      mockPino.mockReturnValue(mockLoggerInstance);

      await import('./logger.js');

      expect(mockPino).toHaveBeenCalledWith(
        expect.objectContaining({
          transport: expect.objectContaining({
            options: expect.objectContaining({translateTime: 'HH:MM:ss'}),
          }),
        }),
      );
    });
    expect.hasAssertions();
  });
});
