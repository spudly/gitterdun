import db from '../../lib/db';
import {sql} from '../sql';
import {CountRowSchema} from '@gitterdun/shared';
import {isPostgresEnabled} from '../env';
import {pgQuery} from '../../lib/pgClient';

export const execSchema = async (schema: string): Promise<void> => {
  if (isPostgresEnabled()) {
    await pgQuery(schema, []);
    return;
  }
  db.exec(schema);
};

export const pragmaTableInfo = async (
  table: string,
): Promise<Array<{name: string}>> => {
  if (isPostgresEnabled()) {
    const res = await pgQuery(
      'SELECT column_name AS name FROM information_schema.columns WHERE table_name = $1',
      [table],
    );
    return (res.rows as Array<{name: string}>).map(row => ({name: row.name}));
  }
  return db.prepare(sql`PRAGMA table_info (${table})`).all() as Array<{
    name: string;
  }>;
};

export const alterTableAddColumn = async (
  table: string,
  columnDef: string,
): Promise<void> => {
  if (isPostgresEnabled()) {
    await pgQuery(
      `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${columnDef};`,
      [],
    );
    return;
  }
  db.prepare(sql`
    ALTER TABLE ${table}
    ADD COLUMN ${columnDef}
  `).run();
};

export const countAdmins = async (): Promise<{count: number}> => {
  if (isPostgresEnabled()) {
    const res = await pgQuery(
      'SELECT COUNT(*)::int AS count FROM users WHERE role = $1',
      ['admin'],
    );
    const row = (res.rows[0] ?? {}) as {count?: number | string};
    const count =
      typeof row.count === 'string'
        ? Number.parseInt(row.count, 10)
        : row.count;
    return CountRowSchema.parse({count});
  }
  return CountRowSchema.parse(
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
};

export const insertDefaultAdmin = async (
  username: string,
  email: string,
  passwordHash: string,
): Promise<void> => {
  if (isPostgresEnabled()) {
    await pgQuery(
      `INSERT INTO users (username, email, password_hash, role, points, streak_count)
       VALUES ($1, $2, $3, 'admin', 0, 0)
       ON CONFLICT (username) DO NOTHING;`,
      [username, email, passwordHash],
    );
    return;
  }
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
  `).run(username, email, passwordHash, 'admin', 0, 0);
};
