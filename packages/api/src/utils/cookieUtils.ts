import type {RequestDefault, TypedResponse} from '../types/http.js';

const parseCookieString = (cookieString: string): Record<string, string> => {
  return cookieString
    .split(';')
    .reduce<Record<string, string>>((acc, part: string) => {
      const [rawKey, ...rest] = part.trim().split('=');
      if (rawKey === undefined || rawKey === '') {
        return acc;
      }
      const key = decodeURIComponent(rawKey);
      const value = decodeURIComponent(rest.join('=') || '');
      acc[key] = value;
      return acc;
    }, {});
};

const extractCookieString = (
  cookieHeader: string | Array<string> | undefined,
): string | undefined => {
  if (cookieHeader === undefined) {
    return undefined;
  }
  const cookieString = Array.isArray(cookieHeader)
    ? cookieHeader.join(';')
    : cookieHeader;
  return cookieString || undefined;
};

export const getCookie = (
  req: RequestDefault,
  name: string,
): string | undefined => {
  const cookieString = extractCookieString(req.headers.cookie);
  if (cookieString === undefined || cookieString === '') {
    return undefined;
  }
  const cookies = parseCookieString(cookieString);
  return cookies[name];
};

export const setSessionCookie = (
  res: TypedResponse,
  sessionId: string,
  expiresAt: Date,
): void => {
  res.cookie('sid', sessionId, {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
    // Set domain to localhost for cross-port cookie sharing in development
    domain: process.env['NODE_ENV'] === 'production' ? undefined : 'localhost',
  });
};
