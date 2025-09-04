import {RoleRowSchema} from '@gitterdun/shared';
import {get} from './crud/db';
import {sql} from './sql';

export const validateParentMembership = async (
  userId: number,
  familyId: number,
): Promise<void> => {
  const membershipRow = (await get(
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
  )) as unknown;
  const membership =
    membershipRow !== undefined
      ? RoleRowSchema.parse(membershipRow as Record<string, unknown>)
      : undefined;
  if (!membership || membership.role !== 'parent') {
    throw Object.assign(new Error('Forbidden'), {status: 403});
  }
};
