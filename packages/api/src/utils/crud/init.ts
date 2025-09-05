import {CountRowSchema} from '@gitterdun/shared';
import {pgQuery} from '../../lib/pgClient';

export const execSchema = async (schema: string): Promise<void> => {
  await pgQuery(schema, []);
};

export const pragmaTableInfo = async (
  table: string,
): Promise<Array<{name: string}>> => {
  const res = await pgQuery(
    'SELECT column_name AS name FROM information_schema.columns WHERE table_name = $1',
    [table],
  );
  return res.rows.map(row => ({name: String(row['name'])}));
};

export const alterTableAddColumn = async (
  table: string,
  columnDef: string,
): Promise<void> => {
  await pgQuery(
    `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${columnDef};`,
    [],
  );
};

export const countAdmins = async (): Promise<{count: number}> => {
  const res = await pgQuery(
    'SELECT COUNT(*)::int AS count FROM users WHERE role = $1',
    ['admin'],
  );
  const row = res.rows[0] as {count?: number} | undefined;
  const count = row?.count ?? 0;
  return CountRowSchema.parse({count});
};

export const insertDefaultAdmin = async (
  username: string,
  email: string,
  passwordHash: string,
): Promise<void> => {
  await pgQuery(
    `INSERT INTO users (username, email, password_hash, role, points, streak_count)
       VALUES ($1, $2, $3, 'admin', 0, 0)
       ON CONFLICT (username) DO NOTHING;`,
    [username, email, passwordHash],
  );
};
