import db from '../lib/db';
import {sql} from './sql';

export const removeAllMembershipsForUser = (userId: number): void => {
  db.prepare(sql`
    DELETE FROM family_members
    WHERE
      user_id = ?
  `).run(userId);
};
