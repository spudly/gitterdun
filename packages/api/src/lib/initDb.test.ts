import {describe, expect, test, beforeEach, jest} from '@jest/globals';

import fs from 'node:fs';
import path from 'node:path';
import {CountRowSchema, asError} from '@gitterdun/shared';
import {initializeDatabase} from './initDb.js';
import * as crudInit from '../utils/crud/init.js';
import {logger} from '../utils/logger.js';

// Mock dependencies before importing
jest.mock('../utils/crud/init', () => ({
  __esModule: true,
  execSchema: jest.fn(),
  countAdmins: jest.fn(),
  insertDefaultAdmin: jest.fn(),
  pragmaTableInfo: jest.fn(),
  alterTableAddColumn: jest.fn(),
}));

jest.mock('../utils/logger', () => ({
  logger: {info: jest.fn(), error: jest.fn()},
}));

jest.mock('node:fs');
jest.mock('node:path');
jest.mock('@gitterdun/shared');

const mockedCrudInit = jest.mocked(crudInit);
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

    mockedCrudInit.execSchema.mockResolvedValue();
    mockedCrudInit.countAdmins.mockResolvedValue({count: 0});
    mockedCrudInit.pragmaTableInfo.mockResolvedValue([]);
    mockedCrudInit.alterTableAddColumn.mockResolvedValue();
    mockedCrudInit.insertDefaultAdmin.mockResolvedValue();

    // Setup default mocks
    mockedPath.join.mockReturnValue('/mock/schema/path.sql');
    mockedFs.readFileSync.mockReturnValue(mockSchemaContent);
    mockedCountRowSchema.parse.mockReturnValue({count: 0});
  });

  test('should initialize database successfully with schema', async () => {
    mockedCrudInit.countAdmins.mockResolvedValue({count: 1});

    await initializeDatabase();

    expect(mockedPath.join).toHaveBeenCalledWith(
      process.cwd(),
      'src/lib/schema.sql',
    );
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      '/mock/schema/path.sql',
      'utf8',
    );

    expect(mockedCrudInit.execSchema).toHaveBeenCalledWith(mockSchemaContent);
    expect(mockedLogger.info).toHaveBeenCalledWith(
      'Database initialized successfully',
    );
  });

  test('should create admin user when none exists', async () => {
    mockedCrudInit.countAdmins.mockResolvedValue({count: 0});

    await initializeDatabase();

    expect(mockedCrudInit.insertDefaultAdmin).toHaveBeenCalledWith(
      'admin',
      'admin@gitterdun.com',
      expect.any(String),
    );
    expect(mockedLogger.info).toHaveBeenCalledWith(
      'Default admin user created: admin@gitterdun.com / admin123',
    );
  });

  test('should not create admin user when one already exists', async () => {
    mockedCrudInit.countAdmins.mockResolvedValue({count: 1});

    await initializeDatabase();

    expect(mockedCrudInit.insertDefaultAdmin).not.toHaveBeenCalled();
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
    const execError = new Error('Database error');
    mockedCrudInit.execSchema.mockRejectedValue(execError);
    mockedAsError.mockReturnValue(execError);

    await expect(initializeDatabase()).rejects.toThrow('Database error');

    expect(mockedLogger.error).toHaveBeenCalledWith(
      {error: execError},
      'Failed to initialize database',
    );
  });

  test('should handle admin user creation errors', async () => {
    const insertError = new Error('Insert failed');
    mockedCrudInit.countAdmins.mockResolvedValue({count: 0});
    mockedCrudInit.insertDefaultAdmin.mockRejectedValue(insertError);
    mockedAsError.mockReturnValue(insertError);

    await expect(initializeDatabase()).rejects.toThrow('Insert failed');

    expect(mockedLogger.error).toHaveBeenCalledWith(
      {error: insertError},
      'Failed to initialize database',
    );
  });

  test('should read Postgres schema when PG is enabled via env', async () => {
    jest.resetModules();

    const fsMock = {readFileSync: jest.fn().mockReturnValue('SQL')};
    const pathMock = {join: jest.fn().mockReturnValue('/mock/schema.sql')};
    jest.doMock('node:fs', () => fsMock);
    jest.doMock('node:path', () => pathMock);

    const originalEnv = {...process.env};
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      PG_URL: 'postgresql://user:pass@localhost:5432/giterdone_postgres',
    } as Record<string, string>;

    const crudInitMock = {
      __esModule: true,
      execSchema: jest.fn(),
      countAdmins: jest.fn(() => ({count: 1})),
      insertDefaultAdmin: jest.fn(),
      pragmaTableInfo: jest.fn(),
      alterTableAddColumn: jest.fn(),
    };
    jest.doMock('../utils/crud/init', () => crudInitMock);

    const {initializeDatabase: initializeDatabasePg} = await import(
      './initDb.js'
    );

    await initializeDatabasePg();

    expect(pathMock.join).toHaveBeenCalledWith(
      process.cwd(),
      'src/lib/schema.sql',
    );
    expect(fsMock.readFileSync).toHaveBeenCalledWith(
      '/mock/schema.sql',
      'utf8',
    );

    process.env = originalEnv;
  });
});
