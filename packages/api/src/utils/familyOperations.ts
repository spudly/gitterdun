import {FamilySchema, FamilyMemberSchema, IdRowSchema} from '@gitterdun/shared';
import type {Family} from '@gitterdun/shared';
import bcrypt from 'bcryptjs';
import {get, all, run} from './crud/db';
import {sql} from './sql';
import {removeAllMembershipsForUser} from './familyMembership';
import {BCRYPT_SALT_ROUNDS} from '../constants';

export const createFamily = (
  name: string,
  userId: number,
  timezone?: string,
) => {
  // Enforce single-family membership: remove any existing memberships first
  removeAllMembershipsForUser(userId);

  const familyRow = get(
    sql`
      INSERT INTO
        families (name, owner_id, timezone)
      VALUES
        (?, ?, ?) RETURNING id,
        name,
        owner_id,
        timezone,
        created_at
    `,
    name,
    userId,
    timezone ?? 'UTC',
  );

  const family = FamilySchema.parse(familyRow);

  run(
    sql`
      INSERT INTO
        family_members (family_id, user_id, role)
      VALUES
        (?, ?, ?)
    `,
    family.id,
    userId,
    'parent',
  );

  return family;
};

export const getFamilyMembers = (familyId: number) => {
  const rows = all(
    sql`
      SELECT
        fm.family_id,
        fm.user_id,
        fm.role,
        u.username,
        u.email
      FROM
        family_members fm
        JOIN users u ON u.id = fm.user_id
      WHERE
        fm.family_id = ?
    `,
    familyId,
  );
  return rows.map(row => FamilyMemberSchema.parse(row));
};

export const getUserFamily = (userId: number): Family | null => {
  const row = get(
    sql`
      SELECT
        f.id,
        f.name,
        f.owner_id,
        f.timezone,
        f.created_at
      FROM
        families f
        JOIN family_members fm ON fm.family_id = f.id
      WHERE
        fm.user_id = ?
      LIMIT
        1
    `,
    userId,
  );
  return row === undefined ? null : FamilySchema.parse(row);
};

export const updateFamilyTimezone = (familyId: number, timezone: string) => {
  const row = get(
    sql`
      UPDATE families
      SET
        timezone = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id = ? RETURNING id,
        name,
        owner_id,
        timezone,
        created_at
    `,
    timezone,
    familyId,
  );
  return FamilySchema.parse(row);
};

export const checkUserExists = (
  email: string | undefined,
  username: string,
): boolean => {
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

export const createChildUser = async (
  username: string,
  email: string | undefined,
  password: string,
): Promise<number> => {
  const resolvedEmail: string | null =
    email != null && email.trim() !== '' ? email : null;
  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const userRow = get(
    sql`
      INSERT INTO
        users (username, email, password_hash, role)
      VALUES
        (?, ?, ?, 'user') RETURNING id
    `,
    username,
    resolvedEmail,
    passwordHash,
  );
  const user = IdRowSchema.parse(userRow);
  return user.id;
};

export const addChildToFamily = (familyId: number, childId: number): void => {
  run(
    sql`
      INSERT INTO
        family_members (family_id, user_id, role)
      VALUES
        (?, ?, ?)
    `,
    familyId,
    childId,
    'child',
  );
};
