import express from 'express';
import crypto from 'node:crypto';
import {
  CreateInvitationSchema,
  AcceptInvitationSchema,
  RoleRowSchema,
  FamilyInvitationRowSchema,
  UserPasswordHashRowSchema,
  IdRowSchema,
  FamilyIdParamSchema,
} from '@gitterdun/shared';
import bcrypt from 'bcryptjs';
import db from '../lib/db';
import {sql} from '../utils/sql';
import {requireUserId} from '../utils/auth';
import {handleRouteError} from '../utils/errorHandling';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

// Authentication utility moved to ../utils/auth

const validateParentMembership = (userId: number, familyId: number): void => {
  const membershipRow = db
    .prepare(sql`
      SELECT
        role
      FROM
        family_members
      WHERE
        family_id = ?
        AND user_id = ?
    `)
    .get(familyId, userId);
  const membership =
    membershipRow !== undefined
      ? RoleRowSchema.parse(membershipRow)
      : undefined;
  if (!membership || membership.role !== 'parent') {
    throw Object.assign(new Error('Forbidden'), {status: 403});
  }
};

type InvitationToken = {token: string; expiresAt: Date};

const generateInvitationToken = (): InvitationToken => {
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
  return {token, expiresAt};
};

type CreateInvitationParams = {
  token: string;
  familyId: number;
  email: string;
  role: string;
  inviterId: number;
  expiresAt: Date;
};

const createInvitation = (params: CreateInvitationParams): void => {
  const {token, familyId, email, role, inviterId, expiresAt} = params;
  db.prepare(sql`
    INSERT INTO
      family_invitations (
        token,
        family_id,
        email,
        role,
        invited_by,
        expires_at
      )
    VALUES
      (?, ?, ?, ?, ?, ?)
  `).run(token, familyId, email, role, inviterId, expiresAt.toISOString());
};

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

export default router;

type InvitationData = {
  token: string;
  family_id: number;
  email: string;
  role: string;
  invited_by: number;
  expires_at: string;
  accepted: number;
};

const validateInvitationToken = (token: string): InvitationData => {
  const invRow = db
    .prepare(sql`
      SELECT
        token,
        family_id,
        email,
        role,
        invited_by,
        expires_at,
        accepted
      FROM
        family_invitations
      WHERE
        token = ?
    `)
    .get(token);
  const inv =
    invRow !== undefined ? FamilyInvitationRowSchema.parse(invRow) : undefined;

  if (!inv) {
    throw Object.assign(new Error('Invalid token'), {status: 400});
  }
  return inv;
};

const validateInvitationExpiry = (invitation: InvitationData): void => {
  if (invitation.accepted) {
    throw Object.assign(new Error('Already used'), {status: 400});
  }
  if (new Date(invitation.expires_at).getTime() < Date.now()) {
    throw Object.assign(new Error('Token expired'), {status: 400});
  }
};

const findExistingUser = (email: string) => {
  const existingRow = db
    .prepare(sql`
      SELECT
        id,
        password_hash
      FROM
        users
      WHERE
        email = ?
    `)
    .get(email);
  return existingRow !== null
    ? UserPasswordHashRowSchema.parse(existingRow)
    : undefined;
};

const authenticateExistingUser = async (
  password: string,
  user: {id: number; password_hash: string},
): Promise<number> => {
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    throw Object.assign(new Error('Invalid credentials'), {status: 401});
  }
  return user.id;
};

const createNewUser = async (
  username: string,
  email: string,
  password: string,
): Promise<number> => {
  const hash = await bcrypt.hash(password, 12);
  const createdRow = db
    .prepare(sql`
      INSERT INTO
        users (username, email, password_hash, role)
      VALUES
        (?, ?, ?, 'user') RETURNING id
    `)
    .get(username, email, hash);
  const created = IdRowSchema.parse(createdRow);
  return created.id;
};

const authenticateOrCreateUser = async (
  email: string,
  username: string,
  password: string,
): Promise<number> => {
  const existing = findExistingUser(email);

  if (existing) {
    return await authenticateExistingUser(password, existing);
  }

  return await createNewUser(username, email, password);
};

const ensureFamilyMembership = (
  familyId: number,
  userId: number,
  role: string,
): void => {
  const member = db
    .prepare(sql`
      SELECT
        1
      FROM
        family_members
      WHERE
        family_id = ?
        AND user_id = ?
    `)
    .get(familyId, userId);
  if (member === undefined) {
    db.prepare(sql`
      INSERT INTO
        family_members (family_id, user_id, role)
      VALUES
        (?, ?, ?)
    `).run(familyId, userId, role);
  }
};

const markInvitationAccepted = (token: string): void => {
  db.prepare(sql`
    UPDATE family_invitations
    SET
      accepted = 1
    WHERE
      token = ?
  `).run(token);
};

// POST /api/invitations/accept - accept an invitation and create/link account
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
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
