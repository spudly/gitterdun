import {sql} from '../sql.js';
import {all, get, run} from './db.js';
import {UserSchema} from '@gitterdun/shared';

export const listUsers = async () => {
  const rows = await all(sql`
    SELECT
      id,
      username,
      email,
      role,
      points,
      streak_count,
      created_at,
      updated_at
    FROM
      users
    ORDER BY
      id ASC
  `);
  const UserListSchema = UserSchema.pick({
    id: true,
    username: true,
    email: true,
    role: true,
    points: true,
    streak_count: true,
    created_at: true,
    updated_at: true,
  });
  return UserListSchema.array().parse(rows);
};

export const updateUserProfile = async (
  id: number,
  displayName: string | null,
  avatarUrl: string | null,
  email: string | null,
): Promise<{changes: number} | {changes?: number}> => {
  return run(
    sql`
      UPDATE users
      SET
        display_name = ?,
        avatar_url = ?,
        email = ?,
        updated_at = current_timestamp
      WHERE
        id = ?
    `,
    displayName,
    avatarUrl,
    email,
    id,
  ) as Promise<{changes: number} | {changes?: number}>;
};

export const getUserById = async (id: number) => {
  const userRow = await get(
    sql`
      SELECT
        id,
        username,
        email,
        role,
        points,
        streak_count,
        display_name,
        avatar_url,
        created_at,
        updated_at
      FROM
        users
      WHERE
        id = ?
    `,
    id,
  );
  const UserByIdSchema = UserSchema.pick({
    id: true,
    username: true,
    email: true,
    role: true,
    points: true,
    streak_count: true,
    display_name: true,
    avatar_url: true,
    created_at: true,
    updated_at: true,
  });
  return UserByIdSchema.nullish().parse(userRow);
};

export const deleteUserById = async (
  id: number,
): Promise<{changes: number}> => {
  return run(
    sql`
      DELETE FROM users
      WHERE
        id = ?
    `,
    id,
  ) as Promise<{changes: number}>;
};

export const clearChoresCreatedBy = async (
  userId: number,
): Promise<unknown> => {
  return run(
    sql`
      UPDATE chores
      SET
        created_by = NULL
      WHERE
        created_by = ?
    `,
    userId,
  );
};

export const deleteInvitationsByInviter = async (
  userId: number,
): Promise<unknown> => {
  return run(
    sql`
      DELETE FROM family_invitations
      WHERE
        invited_by = ?
    `,
    userId,
  );
};
