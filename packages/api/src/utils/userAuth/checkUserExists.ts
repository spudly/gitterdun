import db from '../../lib/db';
import {sql} from '../sql';

export const checkUserExists = (
  email: string | undefined,
  username: string,
) => {
  const trimmedEmail = typeof email === 'string' ? email.trim() : undefined;
  const existingUserRow =
    trimmedEmail !== undefined && trimmedEmail !== ''
      ? db
          .prepare(sql`
            SELECT
              id
            FROM
              users
            WHERE
              email = ?
              OR username = ?
          `)
          .get(trimmedEmail, username)
      : db
          .prepare(sql`
            SELECT
              id
            FROM
              users
            WHERE
              username = ?
          `)
          .get(username);
  return existingUserRow !== null && existingUserRow !== undefined;
};
