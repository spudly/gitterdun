import {RoleRowSchema} from '@gitterdun/shared';
import {get} from './crud/db.js';
import {sql} from './sql.js';

export const validateParentMembership = async (
  userId: number,
  familyId: number,
): Promise<void> => {
  const membershipRow = await get(
    sql`
      SELECT
        role
      FROM
        family_members
      WHERE
        family_id = ?
        AND user_id = ?
    `,
    familyId,
    userId,
  );
  const membership = RoleRowSchema.nullish().parse(membershipRow);
  if (!membership || membership.role !== 'parent') {
    throw Object.assign(new Error('Forbidden'), {status: 403});
  }
};
