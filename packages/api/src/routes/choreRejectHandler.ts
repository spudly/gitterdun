import type express from 'express';
import {StatusCodes} from 'http-status-codes';
import {requireUserId} from '../utils/auth';
import {getUserFamily} from '../utils/familyOperations';
import {rejectChoreAssignment} from '../utils/choreModeration';

export const handleRejectChore = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const userId = await requireUserId(req);
    const family = await getUserFamily(userId);
    if (family === null) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({success: false, error: 'Forbidden'});
      return;
    }
    const choreId = Number((req.params as Record<string, string>)['id']);
    if (!Number.isInteger(choreId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({success: false, error: 'Invalid chore id'});
      return;
    }
    await rejectChoreAssignment(choreId);
    res.json({success: true});
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: (error as Error).message});
  }
};
