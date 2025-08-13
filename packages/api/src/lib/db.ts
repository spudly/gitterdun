import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Allow overriding database path for tests via env var
const resolvedDbPath = process.env['DB_PATH']
  ? path.resolve(process.env['DB_PATH'])
  : path.join(process.cwd(), 'data', 'gitterdun.db');

// Ensure directory exists
const dataDir = path.dirname(resolvedDbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, {recursive: true});
}

// Create database connection
const db = new Database(resolvedDbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

export default db;
