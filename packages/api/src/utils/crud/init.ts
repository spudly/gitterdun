import db from '../../lib/db';
import {sql} from '../sql';
import {CountRowSchema} from '@gitterdun/shared';

export const execSchema = (schema: string): void => {
  db.exec(schema);
};

export const pragmaTableInfo = (table: string): Array<{name: string}> => {
  return db.prepare(sql`PRAGMA table_info (${table})`).all() as Array<{
    name: string;
  }>;
};

export const alterTableAddColumn = (table: string, columnDef: string): void => {
  db.prepare(sql`
    ALTER TABLE ${table}
    ADD COLUMN ${columnDef}
  `).run();
};

export const countAdmins = () => {
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

export const insertDefaultAdmin = (
  username: string,
  email: string,
  passwordHash: string,
) => {
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
