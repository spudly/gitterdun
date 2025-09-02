import {z} from 'zod';
import {get} from '../crud/db';
import {sql} from '../sql';
import {UserWithPasswordRowSchema} from '@gitterdun/shared';

type UserWithPasswordRow = z.infer<typeof UserWithPasswordRowSchema>;

export const findUserByEmail = (
  email: string,
): UserWithPasswordRow | undefined => {
  const userRow = get(
    sql`
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
    `,
    email,
  );
  if (userRow == null) {
    return undefined;
  }
  return UserWithPasswordRowSchema.parse(userRow);
};

export const findUserByUsername = (
  username: string,
): UserWithPasswordRow | undefined => {
  const userRow = get(
    sql`
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
    `,
    username,
  );
  if (userRow == null) {
    return undefined;
  }
  return UserWithPasswordRowSchema.parse(userRow);
};
