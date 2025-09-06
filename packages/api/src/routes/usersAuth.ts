import type {RequestWithBody, TypedResponse} from '../types/http.js';
import {StatusCodes} from 'http-status-codes';
import {getUserFromSession} from '../utils/sessionUtils.js';

export const requireAdmin = async (
  req: RequestWithBody<unknown>,
  res: TypedResponse,
): Promise<boolean> => {
  const user = await getUserFromSession(req);
  if (!user || user.role !== 'admin') {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({success: false, error: 'Forbidden'});
    return false;
  }
  return true;
};
