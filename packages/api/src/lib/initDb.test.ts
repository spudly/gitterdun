import {describe, expect, test, beforeEach, jest} from '@jest/globals';

import fs from 'node:fs';
import path from 'node:path';
import {CountRowSchema, asError} from '@gitterdun/shared';
import {initializeDatabase} from './initDb';
import db from './db';
import {logger} from '../utils/logger';

// Mock dependencies before importing
jest.mock('./db', () => ({
  __esModule: true,
  default: {
    exec: jest.fn(),
    prepare: jest.fn().mockReturnValue({get: jest.fn(), run: jest.fn()}),
  },
}));

jest.mock('../utils/logger', () => ({
  logger: {info: jest.fn(), error: jest.fn()},
}));

jest.mock('node:fs');
jest.mock('node:path');
jest.mock('@gitterdun/shared');

const mockedDb = jest.mocked(db);
const mockedLogger = jest.mocked(logger);
const mockedFs = jest.mocked(fs);
const mockedPath = jest.mocked(path);
const mockedCountRowSchema = jest.mocked(CountRowSchema);
const mockedAsError = jest.mocked(asError);

describe('initializeDatabase', () => {
  const mockSchemaContent = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL
    );
  `;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset all mock implementations to their default state
    mockedDb.exec.mockImplementation(() => ({}) as never);
    mockedDb.prepare.mockReturnValue({
      get: jest.fn(),
      run: jest.fn(),
    } as unknown as ReturnType<typeof mockedDb.prepare>);

    // Setup default mocks
    mockedPath.join.mockReturnValue('/mock/schema/path.sql');
    mockedFs.readFileSync.mockReturnValue(mockSchemaContent);
    mockedCountRowSchema.parse.mockReturnValue({count: 0});
  });

  test('should initialize database successfully with schema', async () => {
    const mockPreparedStatement = {
      get: jest.fn().mockReturnValue({count: 1}),
      run: jest.fn(),
    } as unknown as ReturnType<typeof mockedDb.prepare>;
    mockedDb.prepare.mockReturnValue(mockPreparedStatement);
    mockedCountRowSchema.parse.mockReturnValue({count: 1});

    await initializeDatabase();

    expect(mockedPath.join).toHaveBeenCalledWith(
      process.cwd(),
      'src/lib/schema.sqlite.sql',
    );
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      '/mock/schema/path.sql',
      'utf8',
    );

    expect(mockedDb.exec).toHaveBeenCalledWith(mockSchemaContent);
    expect(mockedLogger.info).toHaveBeenCalledWith(
      'Database initialized successfully',
    );
  });

  test('should create admin user when none exists', async () => {
    const mockPreparedStatement = {
      get: jest.fn().mockReturnValue({count: 0}),
      run: jest.fn(),
    } as unknown as ReturnType<typeof mockedDb.prepare>;
    mockedDb.prepare.mockReturnValue(mockPreparedStatement);
    mockedCountRowSchema.parse.mockReturnValue({count: 0});

    await initializeDatabase();

    // The dynamic import will succeed, but we can still test the behavior
    // by verifying the admin user was created with the expected data

    expect(mockPreparedStatement.run).toHaveBeenCalledWith(
      'admin',
      'admin@gitterdun.com',
      expect.any(String), // The actual hashed password will vary
      'admin',
      0,
      0,
    );
    expect(mockedLogger.info).toHaveBeenCalledWith(
      'Default admin user created: admin@gitterdun.com / admin123',
    );
  });

  test('should not create admin user when one already exists', async () => {
    const mockPreparedStatement = {
      get: jest.fn().mockReturnValue({count: 1}),
      run: jest.fn(),
    } as unknown as ReturnType<typeof mockedDb.prepare>;
    mockedDb.prepare.mockReturnValue(mockPreparedStatement);
    mockedCountRowSchema.parse.mockReturnValue({count: 1});

    await initializeDatabase();

    expect(mockPreparedStatement.run).not.toHaveBeenCalled();
    expect(mockedLogger.info).toHaveBeenCalledWith(
      'Database initialized successfully',
    );
    expect(mockedLogger.info).not.toHaveBeenCalledWith(
      expect.stringContaining('Default admin user created'),
    );
  });

  test('should handle file read errors', async () => {
    const readError = new Error('File not found');
    mockedFs.readFileSync.mockImplementation(() => {
      throw readError;
    });
    mockedAsError.mockReturnValue(readError);

    await expect(initializeDatabase()).rejects.toThrow('File not found');

    expect(mockedLogger.error).toHaveBeenCalledWith(
      {error: readError},
      'Failed to initialize database',
    );
  });

  test('should handle database execution errors', async () => {
    const dbError = new Error('Database error');
    mockedDb.exec.mockImplementation(() => {
      throw dbError;
    });
    mockedAsError.mockReturnValue(dbError);

    await expect(initializeDatabase()).rejects.toThrow('Database error');

    expect(mockedLogger.error).toHaveBeenCalledWith(
      {error: dbError},
      'Failed to initialize database',
    );
  });

  test('should handle admin user creation errors', async () => {
    const insertError = new Error('Insert failed');
    const mockPreparedStatement = {
      get: jest.fn().mockReturnValue({count: 0}),
      run: jest.fn().mockImplementation(() => {
        throw insertError;
      }),
    } as unknown as ReturnType<typeof mockedDb.prepare>;
    mockedDb.prepare.mockReturnValue(mockPreparedStatement);
    mockedCountRowSchema.parse.mockReturnValue({count: 0});
    mockedAsError.mockReturnValue(insertError);

    await expect(initializeDatabase()).rejects.toThrow('Insert failed');

    expect(mockedLogger.error).toHaveBeenCalledWith(
      {error: insertError},
      'Failed to initialize database',
    );
  });
});
