import type {Response} from 'express';
import {createSession} from '../sessionUtils';
import {setSessionCookie} from '../cookieUtils';

export const createLoginSession = async (res: Response, userId: number) => {
  const {sessionId, expiresAt} = await createSession(userId);
  setSessionCookie(res, sessionId, expiresAt);
  return {sessionId, expiresAt};
};
