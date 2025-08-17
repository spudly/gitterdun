import {describe, expect, test, beforeEach, jest} from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

// Mock better-sqlite3 before importing db
const mockDb = {pragma: jest.fn()};
const mockDbConstructor = jest.fn().mockReturnValue(mockDb);
jest.mock('better-sqlite3', () => mockDbConstructor);

// Mock fs
jest.mock('node:fs');
const mockedFs = jest.mocked(fs);

// Mock path
jest.mock('node:path');
const mockedPath = jest.mocked(path);

describe('db module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    // Reset environment variables
    delete process.env['DB_PATH'];
  });

  test('should create database with default path when DB_PATH not set', async () => {
    // Setup mocks before importing
    mockedPath.join.mockReturnValue('/mock/cwd/data/gitterdun.db');
    mockedPath.dirname.mockReturnValue('/mock/cwd/data');
    mockedPath.resolve.mockImplementation(p => p);
    mockedFs.existsSync.mockReturnValue(true);

    // Delete the module from cache to ensure fresh import
    delete require.cache[require.resolve('./db')];

    // Import after mocks are set up
    await import('./db');

    expect(mockedPath.join).toHaveBeenCalledWith(
      process.cwd(),
      'data',
      'gitterdun.db',
    );
    expect(mockDbConstructor).toHaveBeenCalledWith(
      '/mock/cwd/data/gitterdun.db',
    );
    expect(mockDb.pragma).toHaveBeenCalledWith('foreign_keys = ON');
    expect(mockDb.pragma).toHaveBeenCalledWith('journal_mode = WAL');
  });

  test('should use DB_PATH environment variable when set', async () => {
    // Set environment variable
    process.env['DB_PATH'] = '/custom/path/test.db';

    // Setup mocks
    mockedPath.resolve.mockReturnValue('/custom/path/test.db');
    mockedPath.dirname.mockReturnValue('/custom/path');
    mockedPath.join.mockReturnValue('/mock/cwd/data/gitterdun.db');
    mockedFs.existsSync.mockReturnValue(true);

    // Delete the module from cache to ensure fresh import
    delete require.cache[require.resolve('./db')];

    // Import after mocks are set up
    await import('./db');

    expect(mockedPath.resolve).toHaveBeenCalledWith('/custom/path/test.db');
    expect(mockDbConstructor).toHaveBeenCalledWith('/custom/path/test.db');
  });

  test('should create directory if it does not exist', async () => {
    // Setup mocks
    mockedPath.join.mockReturnValue('/mock/cwd/data/gitterdun.db');
    mockedPath.dirname.mockReturnValue('/mock/cwd/data');
    mockedPath.resolve.mockImplementation(p => p);
    mockedFs.existsSync.mockReturnValue(false);
    mockedFs.mkdirSync.mockReturnValue(undefined);

    // Delete the module from cache to ensure fresh import
    delete require.cache[require.resolve('./db')];

    // Import after mocks are set up
    await import('./db');

    expect(mockedFs.existsSync).toHaveBeenCalledWith('/mock/cwd/data');
    expect(mockedFs.mkdirSync).toHaveBeenCalledWith('/mock/cwd/data', {
      recursive: true,
    });
  });

  test('should not create directory if it already exists', async () => {
    // Setup mocks
    mockedPath.join.mockReturnValue('/mock/cwd/data/gitterdun.db');
    mockedPath.dirname.mockReturnValue('/mock/cwd/data');
    mockedPath.resolve.mockImplementation(p => p);
    mockedFs.existsSync.mockReturnValue(true);

    // Delete the module from cache to ensure fresh import
    delete require.cache[require.resolve('./db')];

    // Import after mocks are set up
    await import('./db');

    expect(mockedFs.existsSync).toHaveBeenCalledWith('/mock/cwd/data');
    expect(mockedFs.mkdirSync).not.toHaveBeenCalled();
  });

  test('should configure database with correct pragmas', async () => {
    // Setup mocks
    mockedPath.join.mockReturnValue('/mock/cwd/data/gitterdun.db');
    mockedPath.dirname.mockReturnValue('/mock/cwd/data');
    mockedPath.resolve.mockImplementation(p => p);
    mockedFs.existsSync.mockReturnValue(true);

    // Delete the module from cache to ensure fresh import
    delete require.cache[require.resolve('./db')];

    // Import after mocks are set up
    await import('./db');

    expect(mockDb.pragma).toHaveBeenCalledTimes(2);
    expect(mockDb.pragma).toHaveBeenCalledWith('foreign_keys = ON');
    expect(mockDb.pragma).toHaveBeenCalledWith('journal_mode = WAL');
  });
});
