import fs from 'node:fs';
import path from 'node:path';
import db from './db';
import {asError, CountRowSchema} from '@gitterdun/shared';
import {logger} from '../utils/logger';
import {sql} from '../utils/sql';
import {BCRYPT_SALT_ROUNDS} from '../constants';

const readSchemaFile = (): string => {
  const schemaPath = path.join(process.cwd(), 'src/lib/schema.sqlite.sql');
  return fs.readFileSync(schemaPath, 'utf8');
};

const executeSchema = (schema: string): void => {
  db.exec(schema);
  logger.info('Database initialized successfully');
};

const columnExists = (table: string, column: string): boolean => {
  const row = db.prepare(sql`PRAGMA table_info (${table})`).all() as Array<{
    name: string;
  }>;
  return row.some(rowItem => rowItem.name === column);
};

const ensureUsersProfileColumns = (): void => {
  try {
    if (!columnExists('users', 'display_name')) {
      db.prepare(sql`
        ALTER TABLE users
        ADD COLUMN display_name TEXT
      `).run();
      logger.info("Added 'display_name' column to users table");
    }
    if (!columnExists('users', 'avatar_url')) {
      db.prepare(sql`
        ALTER TABLE users
        ADD COLUMN avatar_url TEXT
      `).run();
      logger.info("Added 'avatar_url' column to users table");
    }
  } catch (error) {
    logger.error(
      {error: asError(error)},
      'Failed ensuring users profile columns',
    );
  }
};

const checkAdminExists = (): boolean => {
  const adminExists = CountRowSchema.parse(
    db
      .prepare(sql`
        SELECT
          COUNT(*) AS count
        FROM
          users
        WHERE
          role = ?
      `)
      .get('admin'),
  );
  return adminExists.count > 0;
};

const createDefaultAdmin = async (): Promise<void> => {
  const bcrypt = await import('bcryptjs');
  const hashedPassword = bcrypt.default.hashSync(
    'admin123',
    BCRYPT_SALT_ROUNDS,
  );

  db.prepare(sql`
    INSERT INTO
      users (
        username,
        email,
        password_hash,
        role,
        points,
        streak_count
      )
    VALUES
      (?, ?, ?, ?, ?, ?)
  `).run('admin', 'admin@gitterdun.com', hashedPassword, 'admin', 0, 0);

  logger.info('Default admin user created: admin@gitterdun.com / admin123');
};

export const initializeDatabase = async (): Promise<void> => {
  try {
    const schema = readSchemaFile();
    executeSchema(schema);
    ensureUsersProfileColumns();

    if (!checkAdminExists()) {
      await createDefaultAdmin();
    }
  } catch (error) {
    logger.error({error: asError(error)}, 'Failed to initialize database');
    throw error;
  }
};
