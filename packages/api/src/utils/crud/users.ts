import {sql} from '../sql';
import {allTyped, getTyped, run} from './db';
import {UserSchema} from '@gitterdun/shared';

export const listUsers = async () => {
  return allTyped(
    UserSchema.pick({
      id: true,
      username: true,
      email: true,
      role: true,
      points: true,
      streak_count: true,
      created_at: true,
      updated_at: true,
    }),
    sql`
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
    `,
  );
};

export const updateUserProfile = async (
  id: number,
  displayName: string | null,
  avatarUrl: string | null,
  email: string | null,
): Promise<unknown> => {
  return run(
    sql`
      UPDATE users
      SET
        display_name = ?,
        avatar_url = ?,
        email = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id = ?
    `,
    displayName,
    avatarUrl,
    email,
    id,
  );
};

export const getUserById = async (id: number) => {
  return getTyped(
    UserSchema.pick({
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
    }),
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
