import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {requireUserId} from '../utils/auth';
import {getUserFamily} from '../utils/familyOperations';
import {validateParentMembership} from '../utils/familyAuthUtils';
import {
  assignChoreToSingleUser,
  approveChoreAssignment,
} from '../utils/choreModeration';

export const handleAssignChore = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = requireUserId(req);
    const family = getUserFamily(userId);
    if (family === null) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({success: false, error: 'Forbidden'});
    }
    validateParentMembership(userId, family.id);
    const choreId = Number((req.params as Record<string, string>)['id']);
    const {userId: assignedUserId} = req.body as {userId?: number};
    if (
      !Number.isInteger(choreId)
      || typeof assignedUserId !== 'number'
      || !Number.isInteger(assignedUserId)
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({success: false, error: 'Invalid chore or user id'});
    }
    assignChoreToSingleUser(choreId, assignedUserId);
    return res.json({success: true});
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: (error as Error).message});
  }
};

export const handleApproveChore = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = requireUserId(req);
    const family = getUserFamily(userId);
    if (family === null) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({success: false, error: 'Forbidden'});
    }
    validateParentMembership(userId, family.id);
    const choreId = Number((req.params as Record<string, string>)['id']);
    const {approvedBy} = req.body as {approvedBy?: number};
    if (
      !Number.isInteger(choreId)
      || typeof approvedBy !== 'number'
      || !Number.isInteger(approvedBy)
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({success: false, error: 'Invalid chore id or approver id'});
    }
    approveChoreAssignment(choreId, approvedBy);
    return res.json({success: true});
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: (error as Error).message});
  }
};
