import db from '../lib/db';
import {sql} from './sql';
import {removeAllMembershipsForUser} from './familyMembership';

type CreateInvitationParams = {
  token: string;
  familyId: number;
  email: string;
  role: string;
  inviterId: number;
  expiresAt: Date;
};

export const createInvitation = ({
  token,
  familyId,
  email,
  role,
  inviterId,
  expiresAt,
}: CreateInvitationParams): void => {
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

export const ensureFamilyMembership = (
  familyId: number,
  userId: number,
  role: string,
): void => {
  // Enforce single-family membership: remove any existing memberships first
  removeAllMembershipsForUser(userId);

  db.prepare(sql`
    INSERT INTO
      family_members (family_id, user_id, role)
    VALUES
      (?, ?, ?)
  `).run(familyId, userId, role);
};

export const markInvitationAccepted = (token: string): void => {
  db.prepare(sql`
    UPDATE family_invitations
    SET
      accepted = 1
    WHERE
      token = ?
  `).run(token);
};
