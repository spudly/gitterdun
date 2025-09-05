import express from 'express';
import crypto from 'node:crypto';
import {StatusCodes} from 'http-status-codes';
import {
  CreateInvitationSchema,
  FamilyIdParamSchema,
  asError,
  ONE_WEEK_MS,
} from '@gitterdun/shared';
import {requireUserId} from '../utils/auth';
import {createInvitation} from '../utils/invitationOperations';
import {getUserFamily} from '../utils/familyOperations';
import {validateParentMembership} from '../utils/familyAuthUtils';
import {logger} from '../utils/logger';
import type {RequestWithParamsAndBody, TypedResponse} from '../types/http';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

// POST /api/invitations/:familyId - invite by email as parent or child
router.post(
  '/:familyId',
  async (
    req: RequestWithParamsAndBody<{familyId: string}, unknown>,
    res: TypedResponse,
  ) => {
    try {
      const inviterId = await requireUserId(req);
      const {familyId} = FamilyIdParamSchema.parse(req.params);
      const family = await getUserFamily(inviterId);
      if (family === null || family.id !== familyId) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({success: false, error: 'Forbidden'});
      }

      const {email, role} = CreateInvitationSchema.parse(req.body);
      await validateParentMembership(inviterId, familyId);

      const token = crypto.randomUUID();
      const expiresAt: Date = new Date(Date.now() + ONE_WEEK_MS);

      await createInvitation({
        token,
        familyId,
        email,
        role,
        inviterId,
        expiresAt,
      });

      logger.info({familyId, email, role}, 'Invitation created');
      return res.json({success: true});
    } catch (error) {
      logger.error({error: asError(error)}, 'Create invitation error');
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({success: false, error: 'Internal server error'});
    }
  },
);

export default router;
