import Db from 'better-sqlite3';
import type {Database} from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

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

// Create database connection
const db: Database = new Db(resolvedDbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

export default db;
