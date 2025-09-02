import express from 'express';
import crypto from 'node:crypto';
import {SessionRowSchema, UserSchema} from '@gitterdun/shared';
import {z} from 'zod';
import {get, run} from './crud/db';
import {sql} from './sql';
import {getCookie} from './cookieUtils';
import {SECURE_TOKEN_BYTES, SESSION_EXPIRATION_MS} from '../constants';

type User = z.infer<typeof UserSchema>;

export const createSession = (userId: number) => {
  const sessionId = crypto.randomBytes(SECURE_TOKEN_BYTES).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_EXPIRATION_MS);

  run(
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

const fetchSessionFromDb = (sessionId: string) => {
  const sessionRow = get(
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
  if (sessionRow === undefined || sessionRow === null) {
    return undefined;
  }
  return SessionRowSchema.parse(sessionRow);
};

const removeExpiredSession = (sessionId: string): void => {
  run(
    sql`
      DELETE FROM sessions
      WHERE
        id = ?
    `,
    sessionId,
  );
};

const validateSessionExpiry = (
  session: {expires_at: string},
  sessionId: string,
): boolean => {
  if (new Date(session.expires_at).getTime() < Date.now()) {
    removeExpiredSession(sessionId);
    return false;
  }
  return true;
};

const validateSession = (sessionId: string) => {
  const session = fetchSessionFromDb(sessionId);

  if (!session) {
    return null;
  }

  if (!validateSessionExpiry(session, sessionId)) {
    return null;
  }

  return session;
};

const getUserById = (userId: number): User | null => {
  const user = get(
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

export const getUserFromSession = (req: express.Request): User | null => {
  const sessionId = getCookie(req, 'sid');
  if (sessionId === undefined) {
    return null;
  }

  const session = validateSession(sessionId);
  if (!session) {
    return null;
  }

  return getUserById(session.user_id);
};

export const deleteSession = (sessionId: string): void => {
  run(
    sql`
      DELETE FROM sessions
      WHERE
        id = ?
    `,
    sessionId,
  );
};
