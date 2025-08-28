import {FamilySchema, FamilyMemberSchema, IdRowSchema} from '@gitterdun/shared';
import bcrypt from 'bcryptjs';
import db from '../lib/db';
import {sql} from './sql';
import {removeAllMembershipsForUser} from './familyMembership';
import {BCRYPT_SALT_ROUNDS} from '../constants';

export const createFamily = (name: string, userId: number) => {
  // Enforce single-family membership: remove any existing memberships first
  removeAllMembershipsForUser(userId);

  const familyRow = db
    .prepare(sql`
      INSERT INTO
        families (name, owner_id)
      VALUES
        (?, ?) RETURNING id,
        name,
        owner_id,
        created_at
    `)
    .get(name, userId);

  const family = FamilySchema.parse(familyRow);

  db.prepare(sql`
    INSERT INTO
      family_members (family_id, user_id, role)
    VALUES
      (?, ?, ?)
  `).run(family.id, userId, 'parent');

  return family;
};

export const getFamilyMembers = (familyId: number) => {
  const rows = db
    .prepare(sql`
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
    `)
    .all(familyId);
  return rows.map(row => FamilyMemberSchema.parse(row));
};

export const getUserFamily = (userId: number) => {
  const row = db
    .prepare(sql`
      SELECT
        f.id,
        f.name,
        f.owner_id,
        f.created_at
      FROM
        families f
        JOIN family_members fm ON fm.family_id = f.id
      WHERE
        fm.user_id = ?
      LIMIT
        1
    `)
    .get(userId);
  return row === undefined ? null : FamilySchema.parse(row);
};

export const checkUserExists = (
  email: string | undefined,
  username: string,
): boolean => {
  const trimmedEmail = typeof email === 'string' ? email.trim() : undefined;
  const existingUserRow =
    trimmedEmail !== undefined && trimmedEmail !== ''
      ? db
          .prepare(sql`
            SELECT
              id
            FROM
              users
            WHERE
              email = ?
              OR username = ?
          `)
          .get(trimmedEmail, username)
      : db
          .prepare(sql`
            SELECT
              id
            FROM
              users
            WHERE
              username = ?
          `)
          .get(username);
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
  const userRow = db
    .prepare(sql`
      INSERT INTO
        users (username, email, password_hash, role)
      VALUES
        (?, ?, ?, 'user') RETURNING id
    `)
    .get(username, resolvedEmail, passwordHash);
  const user = IdRowSchema.parse(userRow);
  return user.id;
};

export const addChildToFamily = (familyId: number, childId: number): void => {
  db.prepare(sql`
    INSERT INTO
      family_members (family_id, user_id, role)
    VALUES
      (?, ?, ?)
  `).run(familyId, childId, 'child');
};
