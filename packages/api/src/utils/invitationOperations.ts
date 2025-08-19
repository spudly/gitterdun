import db from '../lib/db';
import {sql} from './sql';

type CreateInvitationParams = {
  token: string;
  familyId: number;
  email: string;
  role: string;
  inviterId: number;
  expiresAt: Date;
};

export const createInvitation = (params: CreateInvitationParams): void => {
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

export const ensureFamilyMembership = (
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

export const markInvitationAccepted = (token: string): void => {
  db.prepare(sql`
    UPDATE family_invitations
    SET
      accepted = 1
    WHERE
      token = ?
  `).run(token);
};
