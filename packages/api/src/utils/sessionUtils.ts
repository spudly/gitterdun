import express from 'express';
import crypto from 'node:crypto';
import {SessionRowSchema, UserSchema} from '@gitterdun/shared';
import {z} from 'zod';
import {get, run} from './crud/db';
import {sql} from './sql';
import {getCookie} from './cookieUtils';
import {SECURE_TOKEN_BYTES, SESSION_EXPIRATION_MS} from '../constants';

type User = z.infer<typeof UserSchema>;

export const createSession = async (userId: number) => {
  const sessionId = crypto.randomBytes(SECURE_TOKEN_BYTES).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_EXPIRATION_MS);

  await run(
    sql`
      INSERT INTO
        sessions (id, user_id, created_at, expires_at)
      VALUES
        (?, ?, CURRENT_TIMESTAMP, ?)
    `,
    sessionId,
    userId,
    expiresAt.toISOString(),
  );

  return {sessionId, expiresAt};
};

const fetchSessionFromDb = async (sessionId: string) => {
  const sessionRow = await get(
    sql`
      SELECT
        s.user_id AS user_id,
        s.expires_at AS expires_at
      FROM
        sessions s
      WHERE
        s.id = ?
    `,
    sessionId,
  );
  if (sessionRow == null) {
    return undefined;
  }
  return SessionRowSchema.parse(sessionRow);
};

const removeExpiredSession = async (sessionId: string): Promise<void> => {
  await run(
    sql`
      DELETE FROM sessions
      WHERE
        id = ?
    `,
    sessionId,
  );
};

const validateSessionExpiry = async (
  session: {expires_at: string},
  sessionId: string,
): Promise<boolean> => {
  if (new Date(session.expires_at).getTime() < Date.now()) {
    await removeExpiredSession(sessionId);
    return false;
  }
  return true;
};

const validateSession = async (sessionId: string) => {
  const session = await fetchSessionFromDb(sessionId);

  if (!session) {
    return null;
  }

  if (!(await validateSessionExpiry(session, sessionId))) {
    return null;
  }

  return session;
};

const getUserById = async (userId: number): Promise<User | null> => {
  const user = await get(
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
    userId,
  );
  return user === undefined ? null : UserSchema.parse(user);
};

export const getUserFromSession = async (
  req: express.Request,
): Promise<User | null> => {
  const sessionId = getCookie(req, 'sid');
  if (sessionId === undefined) {
    return null;
  }
  try {
    const session = await validateSession(sessionId);
    if (!session) {
      return null;
    }
    const user = await getUserById(session.user_id);
    return user;
  } catch {
    return null;
  }
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await run(
    sql`
      DELETE FROM sessions
      WHERE
        id = ?
    `,
    sessionId,
  );
};
