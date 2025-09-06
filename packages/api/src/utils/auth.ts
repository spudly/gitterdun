import type {RequestDefault} from '../types/http.js';
import {SessionRowSchema} from '@gitterdun/shared';
import {sql} from './sql.js';
import {get, run} from './crud/db.js';
import {getCookie} from './cookieUtils.js';

type SessionData = {user_id: number; expires_at: string};

const extractSessionId = (req: RequestDefault): string => {
  const sid = getCookie(req, 'sid');
  if (sid === undefined) {
    throw Object.assign(new Error('Not authenticated'), {status: 401});
  }
  return sid;
};

const fetchSession = async (
  sessionId: string,
): Promise<SessionData | undefined> => {
  const sessionRow = await get(
    sql`
      SELECT
        user_id,
        expires_at
      FROM
        sessions
      WHERE
        id = ?
    `,
    sessionId,
  );
  return sessionRow !== undefined
    ? SessionRowSchema.parse(sessionRow)
    : undefined;
};

const validateSessionExpiry: (
  session: SessionData | undefined,
  sessionId: string,
) => Promise<void> = async (
  session: SessionData | undefined,
  sessionId: string,
): Promise<void> => {
  if (session === undefined) {
    throw Object.assign(new Error('Not authenticated'), {status: 401});
  }
  if (new Date(session.expires_at).getTime() < Date.now()) {
    await run(
      sql`
        DELETE FROM sessions
        WHERE
          id = ?
      `,
      sessionId,
    );
    throw Object.assign(new Error('Session expired'), {status: 401});
  }
};

export const requireUserId = async (req: RequestDefault): Promise<number> => {
  const sessionId = extractSessionId(req);
  const session = await fetchSession(sessionId);
  await validateSessionExpiry(session, sessionId);
  // At this point, session is not undefined, but assert for TS
  if (session === undefined) {
    throw Object.assign(new Error('Not authenticated'), {status: 401});
  }
  return session.user_id;
};
