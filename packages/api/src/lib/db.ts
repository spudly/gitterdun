import Db from 'better-sqlite3';
import type {Database} from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import {isPostgresEnabled} from '../utils/env';

// Allow overriding database path for tests via env var
const resolvedDbPath =
  process.env['DB_PATH'] !== undefined
    ? path.resolve(process.env['DB_PATH'])
    : path.join(process.cwd(), 'data', 'gitterdun.db');

// Ensure directory exists
const dataDir = path.dirname(resolvedDbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, {recursive: true});
}

// For now, we always return a better-sqlite3 Database instance and rely on
// SQL-layer differences for Postgres-readiness. A future change can swap this
// to a thin adapter with compatible methods when Postgres is enabled.
// Keeping the type to Database ensures existing code compiles.
const db: Database = new Db(resolvedDbPath);

// Enable SQLite-specific pragmas only when not using Postgres
if (!isPostgresEnabled()) {
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
}

export default db;
