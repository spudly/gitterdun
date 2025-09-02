import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import {
  RoleRowSchema,
  FamilyInvitationRowSchema,
  UserPasswordHashRowSchema,
  IdRowSchema,
} from '@gitterdun/shared';
import {get} from './crud/db';
import {sql} from './sql';
import {
  BCRYPT_SALT_ROUNDS,
  INVITATION_TOKEN_BYTES,
  INVITATION_EXPIRATION_MS,
} from '../constants';

type InvitationToken = {token: string; expiresAt: Date};

type InvitationData = {
  token: string;
  family_id: number;
  email: string;
  role: string;
  invited_by: number;
  expires_at: string;
  accepted: number;
};

export const validateParentMembership = (
  userId: number,
  familyId: number,
): void => {
  const membershipRow = get(
    sql`
      SELECT
        role
      FROM
        family_members
      WHERE
        family_id = ?
        AND user_id = ?
    `,
    familyId,
    userId,
  );
  const membership =
    membershipRow !== undefined
      ? RoleRowSchema.parse(membershipRow)
      : undefined;
  if (!membership || membership.role !== 'parent') {
    throw Object.assign(new Error('Forbidden'), {status: 403});
  }
};

export const generateInvitationToken = (): InvitationToken => {
  const token = crypto.randomBytes(INVITATION_TOKEN_BYTES).toString('hex');
  const expiresAt = new Date(Date.now() + INVITATION_EXPIRATION_MS);
  return {token, expiresAt};
};

export const validateInvitationToken = (token: string): InvitationData => {
  const invRow = get(
    sql`
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
    `,
    token,
  );
  const inv =
    invRow !== undefined ? FamilyInvitationRowSchema.parse(invRow) : undefined;

  if (!inv) {
    throw Object.assign(new Error('Invalid token'), {status: 400});
  }
  return inv;
};

export const validateInvitationExpiry = (invitation: InvitationData): void => {
  if (invitation.accepted) {
    throw Object.assign(new Error('Already used'), {status: 400});
  }
  if (new Date(invitation.expires_at).getTime() < Date.now()) {
    throw Object.assign(new Error('Token expired'), {status: 400});
  }
};

const findExistingUser = (email: string) => {
  const existingRow = get(
    sql`
      SELECT
        id,
        password_hash
      FROM
        users
      WHERE
        email = ?
    `,
    email,
  );
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
  const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const createdRow = get(
    sql`
      INSERT INTO
        users (username, email, password_hash, role)
      VALUES
        (?, ?, ?, 'user') RETURNING id
    `,
    username,
    email,
    hash,
  );
  const created = IdRowSchema.parse(createdRow);
  return created.id;
};

export const authenticateOrCreateUser = async (
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
