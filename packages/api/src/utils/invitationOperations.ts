import {run} from './crud/db.js';
import {sql} from './sql.js';
import {removeAllMembershipsForUser} from './familyMembership.js';

type CreateInvitationParams = {
  token: string;
  familyId: number;
  email: string;
  role: string;
  inviterId: number;
  expiresAt: Date;
};

export const createInvitation = async ({
  token,
  familyId,
  email,
  role,
  inviterId,
  expiresAt,
}: CreateInvitationParams): Promise<void> => {
  await run(
    sql`
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
    `,
    token,
    familyId,
    email,
    role,
    inviterId,
    expiresAt.toISOString(),
  );
};

export const ensureFamilyMembership = async (
  familyId: number,
  userId: number,
  role: string,
): Promise<void> => {
  // Enforce single-family membership: remove any existing memberships first
  await removeAllMembershipsForUser(userId);

  await run(
    sql`
      INSERT INTO
        family_members (family_id, user_id, role)
      VALUES
        (?, ?, ?)
    `,
    familyId,
    userId,
    role,
  );
};
