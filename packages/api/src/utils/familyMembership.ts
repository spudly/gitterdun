import {sql} from './sql';
import {run} from './crud/db';

export const removeAllMembershipsForUser = (userId: number): void => {
  run(
    sql`
      DELETE FROM family_members
      WHERE
        user_id = ?
    `,
    userId,
  );
};
