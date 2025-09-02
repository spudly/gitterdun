import {sql} from '../sql';
import {all, get, run} from './db';

export const listUsers = () => {
  return all(sql`
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
};

export const updateUserProfile = (
  id: number,
  displayName: string | null,
  avatarUrl: string | null,
  email: string | null,
) => {
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

export const getUserById = (id: number) => {
  return get(
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

export const deleteUserById = (id: number) => {
  return run(
    sql`
      DELETE FROM users
      WHERE
        id = ?
    `,
    id,
  );
};

export const clearChoresCreatedBy = (userId: number) => {
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

export const deleteInvitationsByInviter = (userId: number) => {
  return run(
    sql`
      DELETE FROM family_invitations
      WHERE
        invited_by = ?
    `,
    userId,
  );
};
