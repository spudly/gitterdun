import type {Response} from 'express';
import {createSession} from '../sessionUtils';
import {setSessionCookie} from '../cookieUtils';

export const createLoginSession = (res: Response, userId: number) => {
  const {sessionId, expiresAt} = createSession(userId);
  setSessionCookie(res, sessionId, expiresAt);
  return {sessionId, expiresAt};
};
