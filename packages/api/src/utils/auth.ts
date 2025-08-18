import express from 'express';
import {SessionRowSchema} from '@gitterdun/shared';
import db from '../lib/db';
import {sql} from './sql';

type SessionData = {user_id: number; expires_at: string};

const getCookie = (req: express.Request, name: string): string | undefined => {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader === undefined) {
    return undefined;
  }
  const cookieString = Array.isArray(cookieHeader)
    ? cookieHeader.join(';')
    : cookieHeader;
  const cookies = cookieString
    .split(';')
    .map(cookie => cookie.trim())
    .reduce((acc: Record<string, string>, cookie) => {
      const [rawKey, ...rest] = cookie.split('=');
      if (rawKey === undefined) {
        return acc;
      }
      const key = decodeURIComponent(rawKey);
      const value = decodeURIComponent(rest.join('=') || '');
      acc[key] = value;
      return acc;
    }, {});
  return cookies[name];
};

const extractSessionId = (req: express.Request): string => {
  const sid = getCookie(req, 'sid');
  if (sid === undefined) {
    throw Object.assign(new Error('Not authenticated'), {status: 401});
  }
  return sid;
};

const fetchSession = (sessionId: string): SessionData | undefined => {
  const sessionRow = db
    .prepare(sql`
      SELECT
        user_id,
        expires_at
      FROM
        sessions
      WHERE
        id = ?
    `)
    .get(sessionId);
  return sessionRow !== undefined
    ? SessionRowSchema.parse(sessionRow)
    : undefined;
};

const validateSessionExpiry: (
  session: SessionData | undefined,
  sessionId: string,
) => asserts session is SessionData = (
  session: SessionData | undefined,
  sessionId: string,
): asserts session is SessionData => {
  if (session === undefined) {
    throw Object.assign(new Error('Not authenticated'), {status: 401});
  }
  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare(sql`
      DELETE FROM sessions
      WHERE
        id = ?
    `).run(sessionId);
    throw Object.assign(new Error('Session expired'), {status: 401});
  }
};

export const requireUserId = (req: express.Request): number => {
  const sessionId = extractSessionId(req);
  const session = fetchSession(sessionId);
  validateSessionExpiry(session, sessionId);
  return session.user_id;
};
