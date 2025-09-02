import {get} from '../crud/db';
import {sql} from '../sql';

export const checkUserExists = (
  email: string | undefined,
  username: string,
) => {
  const trimmedEmail = typeof email === 'string' ? email.trim() : undefined;
  const existingUserRow =
    trimmedEmail !== undefined && trimmedEmail !== ''
      ? get(
          sql`
            SELECT
              id
            FROM
              users
            WHERE
              email = ?
              OR username = ?
          `,
          trimmedEmail,
          username,
        )
      : get(
          sql`
            SELECT
              id
            FROM
              users
            WHERE
              username = ?
          `,
          username,
        );
  return existingUserRow !== null && existingUserRow !== undefined;
};
