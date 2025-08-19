import {RoleRowSchema} from '@gitterdun/shared';
import db from '../lib/db';
import {sql} from './sql';

export const validateParentMembership = (
  userId: number,
  familyId: number,
): void => {
  const membershipRow = db
    .prepare(sql`
      SELECT
        role
      FROM
        family_members
      WHERE
        family_id = ?
        AND user_id = ?
    `)
    .get(familyId, userId);
  const membership =
    membershipRow !== undefined
      ? RoleRowSchema.parse(membershipRow)
      : undefined;
  if (!membership || membership.role !== 'parent') {
    throw Object.assign(new Error('Forbidden'), {status: 403});
  }
};

export const checkIsFamilyMember = (
  userId: number,
  familyId: number,
): boolean => {
  const isMember = db
    .prepare(sql`
      SELECT
        1
      FROM
        family_members
      WHERE
        family_id = ?
        AND user_id = ?
    `)
    .get(familyId, userId);
  return isMember !== undefined;
};
