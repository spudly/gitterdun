import {sql} from './sql';
import {run} from './crud/db';

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
