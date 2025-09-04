import type express from 'express';
import {StatusCodes} from 'http-status-codes';
import {getUserFromSession} from '../utils/sessionUtils';

export const requireAdmin = async (
  req: express.Request,
  res: express.Response,
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
