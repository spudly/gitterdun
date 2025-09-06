import type {RequestDefault} from '../types/http.js';
import crypto from 'node:crypto';
import {SessionRowSchema, UserSchema} from '@gitterdun/shared';
import {z} from 'zod';
import {get, run} from './crud/db.js';
import {sql} from './sql.js';
import {getCookie} from './cookieUtils.js';
import {SECURE_TOKEN_BYTES, SESSION_EXPIRATION_DAYS} from '../constants.js';
import {addDays, isPast, parseISO} from 'date-fns';

type User = z.infer<typeof UserSchema>;

export const createSession = async (
  userId: number,
): Promise<{sessionId: string; expiresAt: Date}> => {
  const sessionId = crypto.randomBytes(SECURE_TOKEN_BYTES).toString('hex');
  const expiresAt = addDays(new Date(), SESSION_EXPIRATION_DAYS);

  await run(
    sql`
      INSERT INTO
        sessions (id, user_id, created_at, expires_at)
      VALUES
        (?, ?, current_timestamp, ?)
    `,
    sessionId,
    userId,
    expiresAt.toISOString(),
  );

  return {sessionId, expiresAt};
};

const fetchSessionFromDb = async (
  sessionId: string,
): Promise<z.infer<typeof SessionRowSchema> | undefined> => {
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
  if (isPast(parseISO(session.expires_at))) {
    await removeExpiredSession(sessionId);
    return false;
  }
  return true;
};

const validateSession = async (
  sessionId: string,
): Promise<z.infer<typeof SessionRowSchema> | null> => {
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
  req: RequestDefault,
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
