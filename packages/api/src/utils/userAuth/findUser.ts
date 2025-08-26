import {z} from 'zod';
import db from '../../lib/db';
import {sql} from '../sql';
import {UserWithPasswordRowSchema} from '@gitterdun/shared';

type UserWithPasswordRow = z.infer<typeof UserWithPasswordRowSchema>;

export const findUserByEmail = (
  email: string,
): UserWithPasswordRow | undefined => {
  const userRow = db
    .prepare(sql`
      SELECT
        id,
        username,
        email,
        password_hash,
        role,
        points,
        streak_count,
        created_at,
        updated_at
      FROM
        users
      WHERE
        email = ?
    `)
    .get(email);
  return userRow === null
    ? undefined
    : UserWithPasswordRowSchema.parse(userRow);
};

export const findUserByUsername = (
  username: string,
): UserWithPasswordRow | undefined => {
  const userRow = db
    .prepare(sql`
      SELECT
        id,
        username,
        email,
        password_hash,
        role,
        points,
        streak_count,
        created_at,
        updated_at
      FROM
        users
      WHERE
        username = ?
    `)
    .get(username);
  return userRow === null
    ? undefined
    : UserWithPasswordRowSchema.parse(userRow);
};
