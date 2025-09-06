import {sql} from './sql.js';
import {run} from './crud/db.js';

export const removeAllMembershipsForUser = async (
  userId: number,
): Promise<void> => {
  await run(
    sql`
      DELETE FROM family_members
      WHERE
        user_id = ?
    `,
    userId,
  );
};
