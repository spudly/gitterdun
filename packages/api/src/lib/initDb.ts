import fs from 'node:fs';
import path from 'node:path';
import {asError} from '@gitterdun/shared';
import {logger} from '../utils/logger';
import {BCRYPT_SALT_ROUNDS} from '../constants';
import {run} from '../utils/crud/db';
import {sql} from '../utils/sql';
import {
  alterTableAddColumn,
  countAdmins,
  execSchema,
  insertDefaultAdmin,
  pragmaTableInfo,
} from '../utils/crud/init';

const readSchemaFile = (): string => {
  const schemaPath = path.join(process.cwd(), 'src/lib/schema.sqlite.sql');
  return fs.readFileSync(schemaPath, 'utf8');
};

const executeSchema = (schema: string): void => {
  execSchema(schema);
  logger.info('Database initialized successfully');
};

const columnExists = (table: string, column: string): boolean => {
  const row = pragmaTableInfo(table);
  return row.some(rowItem => rowItem.name === column);
};

const ensureUsersProfileColumns = (): void => {
  try {
    if (!columnExists('users', 'display_name')) {
      alterTableAddColumn('users', 'display_name TEXT');
      logger.info("Added 'display_name' column to users table");
    }
    if (!columnExists('users', 'avatar_url')) {
      alterTableAddColumn('users', 'avatar_url TEXT');
      logger.info("Added 'avatar_url' column to users table");
    }
  } catch (error) {
    logger.error(
      {error: asError(error)},
      'Failed ensuring users profile columns',
    );
  }
};

const ensureFamilyUpdatedAt = (): void => {
  try {
    if (!columnExists('families', 'updated_at')) {
      alterTableAddColumn(
        'families',
        'updated_at datetime DEFAULT CURRENT_TIMESTAMP',
      );
      logger.info("Added 'updated_at' column to families table");
    }
  } catch (error) {
    logger.error(
      {error: asError(error)},
      'Failed ensuring families.updated_at',
    );
  }
};

const ensureChoreFamilyId = (): void => {
  try {
    if (!columnExists('chores', 'family_id')) {
      alterTableAddColumn('chores', 'family_id INTEGER');
      // Backfill: set family_id for chores created by users who belong to a family
      run(sql`
        UPDATE chores
        SET
          family_id = (
            SELECT
              family_id
            FROM
              family_members
            WHERE
              user_id = chores.created_by
          )
        WHERE
          family_id IS NULL
      `);
      logger.info("Added 'family_id' column to chores table");
    }
    // Enforce NOT NULL at runtime by validating before inserts; schema NOT NULL may fail on old rows
  } catch (error) {
    logger.error({error: asError(error)}, 'Failed ensuring chores.family_id');
  }
};

const checkAdminExists = (): boolean => {
  const adminExists = countAdmins();
  return adminExists.count > 0;
};

const createDefaultAdmin = async (): Promise<void> => {
  const bcrypt = await import('bcryptjs');
  const hashedPassword = bcrypt.default.hashSync(
    'admin123',
    BCRYPT_SALT_ROUNDS,
  );

  insertDefaultAdmin('admin', 'admin@gitterdun.com', hashedPassword);

  logger.info('Default admin user created: admin@gitterdun.com / admin123');
};

export const initializeDatabase = async (): Promise<void> => {
  try {
    const schema = readSchemaFile();
    executeSchema(schema);
    ensureUsersProfileColumns();
    ensureFamilyUpdatedAt();
    ensureChoreFamilyId();

    if (!checkAdminExists()) {
      await createDefaultAdmin();
    }
  } catch (error) {
    logger.error({error: asError(error)}, 'Failed to initialize database');
    throw error;
  }
};
