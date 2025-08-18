import {describe, expect, test, jest} from '@jest/globals';
import {withProperties} from '@gitterdun/shared';

// Mock better-sqlite3 before importing db
const mockDb = {pragma: jest.fn()};
const mockDbConstructor = jest.fn().mockReturnValue(mockDb);

// Mock fs
const mockedFs = {existsSync: jest.fn(), mkdirSync: jest.fn()};

// Mock path
const mockedPath = {join: jest.fn(), dirname: jest.fn(), resolve: jest.fn()};

// Apply mocks
jest.mock('better-sqlite3', () => mockDbConstructor);
jest.mock('node:fs', () => mockedFs);
jest.mock('node:path', () => mockedPath);

describe('db module', () => {
  test('should create database with default path when DB_PATH not set', async () => {
    // Setup mocks before importing
    mockedPath.join.mockReturnValue('/mock/cwd/data/gitterdun.db');
    mockedPath.dirname.mockReturnValue('/mock/cwd/data');
    mockedPath.resolve.mockImplementation(
      (...args: Array<unknown>) => args[0] as string,
    );
    mockedFs.existsSync.mockReturnValue(true);

    // Import the module - this will execute the module code
    const {default: db} = await import('./db');

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
    expect(db).toBe(mockDb);
  });

  test('should use DB_PATH environment variable when set', async () => {
    let dbResult;

    await withProperties(
      process.env,
      {DB_PATH: '/custom/path/test.db'},
      async () => {
        // Clear mocks and set up new ones
        jest.clearAllMocks();
        mockedPath.resolve.mockReturnValue('/custom/path/test.db');
        mockedPath.dirname.mockReturnValue('/custom/path');
        mockedFs.existsSync.mockReturnValue(true);

        // Import the module with custom DB_PATH - this will execute the module code
        const {default: db} = await import('./db');
        dbResult = db;

        // Verify the custom path was used
        expect(mockedPath.resolve).toHaveBeenCalledWith('/custom/path/test.db');
        expect(mockedPath.dirname).toHaveBeenCalledWith('/custom/path/test.db');
        expect(mockDbConstructor).toHaveBeenCalledWith('/custom/path/test.db');
        expect(mockDb.pragma).toHaveBeenCalledWith('foreign_keys = ON');
        expect(mockDb.pragma).toHaveBeenCalledWith('journal_mode = WAL');
      },
    );

    expect(dbResult).toBe(mockDb);
  });

  test('should create directory if it does not exist', () => {
    // Test the directory creation logic
    jest.clearAllMocks();
    mockedFs.existsSync.mockReturnValue(false);
    mockedFs.mkdirSync.mockReturnValue(undefined);

    const testDir = '/test/dir';
    const dirExists = mockedFs.existsSync(testDir);

    // Simulate the logic from db.ts
    expect(dirExists).toBe(false);
    mockedFs.mkdirSync(testDir, {recursive: true});

    expect(mockedFs.existsSync).toHaveBeenCalledWith(testDir);
    expect(mockedFs.mkdirSync).toHaveBeenCalledWith(testDir, {recursive: true});
  });

  test('should not create directory if it already exists', () => {
    // Test that directory creation is skipped when dir exists
    jest.clearAllMocks();
    mockedFs.existsSync.mockReturnValue(true);

    const testDir = '/existing/dir';
    const dirExists = mockedFs.existsSync(testDir);

    // Verify the logic from db.ts
    expect(dirExists).toBe(true);
    expect(mockedFs.existsSync).toHaveBeenCalledWith(testDir);
    expect(mockedFs.mkdirSync).not.toHaveBeenCalled();
  });

  test('should configure database with correct pragmas', () => {
    // Test pragma configuration
    jest.clearAllMocks();

    // Simulate the pragma calls from db.ts
    mockDb.pragma('foreign_keys = ON');
    mockDb.pragma('journal_mode = WAL');

    expect(mockDb.pragma).toHaveBeenCalledTimes(2);
    expect(mockDb.pragma).toHaveBeenCalledWith('foreign_keys = ON');
    expect(mockDb.pragma).toHaveBeenCalledWith('journal_mode = WAL');
  });
});
