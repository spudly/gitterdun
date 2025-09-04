import {get} from '../crud/db';
import {sql} from '../sql';

export const checkUserExists = async (
  email: string | undefined,
  username: string,
): Promise<boolean> => {
  const trimmedEmail = typeof email === 'string' ? email.trim() : undefined;
  const existingUserRow =
    trimmedEmail !== undefined && trimmedEmail !== ''
      ? await get(
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
      : await get(
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
  return existingUserRow != null;
};
