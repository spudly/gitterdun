import express from 'express';
import {
  CreateInvitationSchema,
  AcceptInvitationSchema,
  FamilyIdParamSchema,
} from '@gitterdun/shared';
import {requireUserId} from '../utils/auth';
import {handleRouteError} from '../utils/errorHandling';
import {
  validateParentMembership,
  generateInvitationToken,
  validateInvitationToken,
  validateInvitationExpiry,
  authenticateOrCreateUser,
} from '../utils/invitationAuthUtils';
import {
  createInvitation,
  ensureFamilyMembership,
  markInvitationAccepted,
} from '../utils/invitationOperations';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

// Authentication utility moved to ../utils/auth

// POST /api/invitations/:familyId - invite by email as parent or child
router.post('/:familyId', (req, res) => {
  try {
    const inviterId = requireUserId(req);
    const {familyId} = FamilyIdParamSchema.parse(req.params);
    const {email, role} = CreateInvitationSchema.parse(req.body);

    validateParentMembership(inviterId, familyId);

    const {token, expiresAt} = generateInvitationToken();
    createInvitation({token, familyId, email, role, inviterId, expiresAt});

    // Email sending would go here; return token for dev
    return res.json({success: true, message: 'Invitation created', token});
  } catch (error) {
    return handleRouteError(res, error, 'Create invitation');
  }
});

// POST /api/invitations/accept - accept an invitation and create/link account
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- properly handled with try-catch
router.post('/accept', async (req, res) => {
  try {
    const {token, username, password} = AcceptInvitationSchema.parse(req.body);
    const invitation = validateInvitationToken(token);
    validateInvitationExpiry(invitation);

    const userId = await authenticateOrCreateUser(
      invitation.email,
      username,
      password,
    );
    ensureFamilyMembership(invitation.family_id, userId, invitation.role);
    markInvitationAccepted(token);

    return res.json({success: true, message: 'Invitation accepted'});
  } catch (error) {
    return handleRouteError(res, error, 'Accept invitation');
  }
});

export default router;
