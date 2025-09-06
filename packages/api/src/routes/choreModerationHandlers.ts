import {asError} from '@gitterdun/shared';
import type {RequestWithParamsAndBody, TypedResponse} from '../types/http.js';
import {z} from 'zod';
import {StatusCodes} from 'http-status-codes';
import {requireUserId} from '../utils/auth.js';
import {getUserFamily} from '../utils/familyOperations.js';
import {validateParentMembership} from '../utils/familyAuthUtils.js';
import {
  assignChoreToSingleUser,
  approveChoreAssignment,
} from '../utils/choreModeration.js';

const AssignChoreBodySchema = z.object({userId: z.number().int()});
type AssignChoreBody = z.infer<typeof AssignChoreBodySchema>;

export const handleAssignChore = async (
  req: RequestWithParamsAndBody<{id: string}, AssignChoreBody>,
  res: TypedResponse,
): Promise<void> => {
  try {
    const userId = await requireUserId(req);
    const family = await getUserFamily(userId);
    if (family === null) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({success: false, error: 'Forbidden'});
    } else {
      await validateParentMembership(userId, family.id);
      const choreId = Number(req.params.id);
      const {userId: assignedUserId} = AssignChoreBodySchema.parse(req.body);
      if (!Number.isInteger(choreId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({success: false, error: 'Invalid chore or user id'});
      } else {
        await assignChoreToSingleUser(choreId, assignedUserId);
        res.json({success: true});
      }
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: asError(error).message});
  }
};

const ApproveChoreBodySchema = z.object({approvedBy: z.number().int()});
type ApproveChoreBody = z.infer<typeof ApproveChoreBodySchema>;

export const handleApproveChore = async (
  req: RequestWithParamsAndBody<{id: string}, ApproveChoreBody>,
  res: TypedResponse,
): Promise<void> => {
  try {
    const userId = await requireUserId(req);
    const family = await getUserFamily(userId);
    if (family === null) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({success: false, error: 'Forbidden'});
    } else {
      await validateParentMembership(userId, family.id);
      const choreId = Number(req.params.id);
      const {approvedBy} = ApproveChoreBodySchema.parse(req.body);
      if (!Number.isInteger(choreId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({success: false, error: 'Invalid chore id or approver id'});
      } else {
        await approveChoreAssignment(choreId, approvedBy);
        res.json({success: true});
      }
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: asError(error).message});
  }
};
