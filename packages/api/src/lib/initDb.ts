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

    if (!checkAdminExists()) {
      await createDefaultAdmin();
    }
  } catch (error) {
    logger.error({error: asError(error)}, 'Failed to initialize database');
    throw error;
  }
};
