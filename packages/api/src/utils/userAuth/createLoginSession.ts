import type {Response} from 'express';
import type {TypedResponse} from '../../types/http';
import {createSession} from '../sessionUtils';
import {setSessionCookie} from '../cookieUtils';

export const createLoginSession = async (
  res: Response | TypedResponse,
  userId: number,
): Promise<{sessionId: string; expiresAt: Date}> => {
  const {sessionId, expiresAt} = await createSession(userId);
  setSessionCookie(res, sessionId, expiresAt);
  return {sessionId, expiresAt};
};
