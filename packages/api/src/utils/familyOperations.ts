import {
  FamilySchema,
  IdRowSchema,
  FamilyMemberSchema,
  OutgoingFamilySchema,
} from '@gitterdun/shared';
import type {OutgoingFamily} from '@gitterdun/shared';
import bcrypt from 'bcryptjs';
import {get, run, all} from './crud/db.js';
import {sql} from './sql.js';
import {removeAllMembershipsForUser} from './familyMembership.js';
import {BCRYPT_SALT_ROUNDS} from '../constants.js';

export const createFamily = async (
  name: string,
  userId: number,
  timezone?: string,
): Promise<OutgoingFamily> => {
  // Enforce single-family membership: remove any existing memberships first
  await removeAllMembershipsForUser(userId);

  const familyRow = await get(
    sql`
      INSERT INTO
        families (name, owner_id, timezone)
      VALUES
        (?, ?, ?)
      RETURNING
        id,
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

  await run(
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

  return OutgoingFamilySchema.parse(family);
};

export const getUserFamily = async (
  userId: number,
): Promise<OutgoingFamily | null> => {
  const row = await get(
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
  if (row === undefined) {
    return null;
  }
  const family = FamilySchema.parse(row);
  return OutgoingFamilySchema.parse(family);
};

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

export const createChildUser = async (
  username: string,
  email: string | undefined,
  password: string,
): Promise<number> => {
  const resolvedEmail: string | null =
    email != null && email.trim() !== '' ? email : null;
  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const userRow = await get(
    sql`
      INSERT INTO
        users (username, email, password_hash, role)
      VALUES
        (?, ?, ?, 'user')
      RETURNING
        id
    `,
    username,
    resolvedEmail,
    passwordHash,
  );
  const user = IdRowSchema.parse(userRow);
  return user.id;
};

export const addChildToFamily = async (
  familyId: number,
  childId: number,
): Promise<void> => {
  await run(
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

export const getFamilyMembers = async (familyId: number) => {
  const rows = await all(
    sql`
      SELECT
        fm.family_id,
        fm.user_id,
        fm.role,
        u.username,
        u.email
      FROM
        family_members fm
        JOIN users u ON fm.user_id = u.id
      WHERE
        fm.family_id = ?
      ORDER BY
        fm.role ASC,
        u.username ASC
    `,
    familyId,
  );

  return rows.map(row => FamilyMemberSchema.parse(row));
};
