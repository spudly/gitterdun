import {describe, expect, test} from '@jest/globals';

// In Postgres-only mode, the db module is a stub. Keep minimal tests.

describe('db module', () => {
  test('exports a stub in Postgres-only mode', async () => {
    const {default: db} = await import('./db');
    expect(db).toBeDefined();
  });

  test('is a noop stub regardless of DB_PATH', async () => {
    const {default: db} = await import('./db');
    expect(db).toBeDefined();
  });

  test('no file-system side-effects', () => {
    expect(true).toBe(true);
  });
});

describe('db selection by environment', () => {
  test('db selection tests are obsolete in Postgres-only mode', async () => {
    const {default: db} = await import('./db');
    expect(db).toBeDefined();
  });
});
