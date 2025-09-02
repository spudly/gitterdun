import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {rejectChoreAssignment} from '../utils/choreModeration';
import {requireUserId} from '../utils/auth';
import {getUserFamily} from '../utils/familyOperations';
import {validateParentMembership} from '../utils/familyAuthUtils';

export const handleRejectChore = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    const userId = requireUserId(req);
    const family = getUserFamily(userId);
    if (family === null) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({success: false, error: 'Forbidden'});
      return;
    }
    validateParentMembership(userId, family.id);
    const choreIdRaw = (req.params as Record<string, string>)['id'];
    const choreId = Number(choreIdRaw);
    if (!Number.isInteger(choreId)) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({success: false, error: 'Invalid chore id'});
      return;
    }
    rejectChoreAssignment(choreId);
    res.json({success: true});
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: (error as Error).message});
  }
};
