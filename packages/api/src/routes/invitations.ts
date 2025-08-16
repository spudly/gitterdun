import express from 'express';
import crypto from 'node:crypto';
import {z} from 'zod';
import {
  CreateInvitationSchema,
  AcceptInvitationSchema,
  SessionRowSchema,
  RoleRowSchema,
  FamilyInvitationRowSchema,
  UserPasswordHashRowSchema,
  IdRowSchema,
  asError,
  FamilyIdParamSchema,
} from '@gitterdun/shared';
import bcrypt from 'bcryptjs';
import db from '../lib/db';
import {sql} from '../utils/sql';

const router = express.Router();

const getCookie = (req: express.Request, name: string): string | undefined => {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader === undefined) {
    return undefined;
  }
  const cookieString = Array.isArray(cookieHeader)
    ? cookieHeader.join(';')
    : cookieHeader;
  const cookies = cookieString
    .split(';')
    .reduce<Record<string, string>>((acc, part) => {
      const [rawKey, ...rest] = part.trim().split('=');
      if (!rawKey) {
        return acc;
      }
      const key = decodeURIComponent(rawKey);
      const value = decodeURIComponent(rest.join('=') || '');
      acc[key] = value;
      return acc;
    }, {});
  return cookies[name];
};

const requireUserId = (req: express.Request): number => {
  const sid = getCookie(req, 'sid');
  if (sid === undefined) {
    throw Object.assign(new Error('Not authenticated'), {status: 401});
  }
  const sessionRow = db
    .prepare(sql`
      SELECT
        user_id,
        expires_at
      FROM
        sessions
      WHERE
        id = ?
    `)
    .get(sid);
  const session =
    sessionRow !== undefined ? SessionRowSchema.parse(sessionRow) : undefined;
  if (!session) {
    throw Object.assign(new Error('Not authenticated'), {status: 401});
  }
  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare(sql`
      DELETE FROM sessions
      WHERE
        id = ?
    `).run(sid);
    throw Object.assign(new Error('Session expired'), {status: 401});
  }
  return session.user_id;
};

// POST /api/invitations/:familyId - invite by email as parent or child
router.post('/:familyId', (req, res) => {
  try {
    const inviterId = requireUserId(req);
    const {familyId} = FamilyIdParamSchema.parse(req.params);
    const {email, role} = CreateInvitationSchema.parse(req.body);

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
      .get(familyId, inviterId);
    const membership =
      membershipRow !== undefined
        ? RoleRowSchema.parse(membershipRow)
        : undefined;
    if (!membership || membership.role !== 'parent') {
      return res.status(403).json({success: false, error: 'Forbidden'});
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
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

    // Email sending would go here; return token for dev
    return res.json({success: true, message: 'Invitation created', token});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({success: false, error: 'Invalid request'});
    }
    return res
      .status(asError(error).status ?? 500)
      .json({success: false, error: asError(error).message || 'Server error'});
  }
});

export default router;

// POST /api/invitations/accept - accept an invitation and create/link account
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.post('/accept', async (req, res) => {
  try {
    const {token, username, password} = AcceptInvitationSchema.parse(req.body);
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
      invRow !== undefined
        ? FamilyInvitationRowSchema.parse(invRow)
        : undefined;

    if (!inv) {
      return res.status(400).json({success: false, error: 'Invalid token'});
    }
    if (inv.accepted) {
      return res.status(400).json({success: false, error: 'Already used'});
    }
    if (new Date(inv.expires_at).getTime() < Date.now()) {
      return res.status(400).json({success: false, error: 'Token expired'});
    }

    // If user exists by email, verify password; else create new user
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
      .get(inv.email);
    const existing =
      existingRow !== null
        ? UserPasswordHashRowSchema.parse(existingRow)
        : undefined;

    // eslint-disable-next-line @typescript-eslint/init-declarations -- will be initialized in if or else
    let userId: number;
    if (existing) {
      const ok = await bcrypt.compare(password, existing.password_hash);
      if (!ok) {
        return res
          .status(401)
          .json({success: false, error: 'Invalid credentials'});
      }
      userId = existing.id;
    } else {
      const hash = await bcrypt.hash(password, 12);
      const createdRow = db
        .prepare(sql`
          INSERT INTO
            users (username, email, password_hash, role)
          VALUES
            (?, ?, ?, 'user') RETURNING id
        `)
        .get(username, inv.email, hash);
      const created = IdRowSchema.parse(createdRow);
      userId = created.id;
    }

    // Add membership if not already
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
      .get(inv.family_id, userId);
    if (member === undefined) {
      db.prepare(sql`
        INSERT INTO
          family_members (family_id, user_id, role)
        VALUES
          (?, ?, ?)
      `).run(inv.family_id, userId, inv.role);
    }

    db.prepare(sql`
      UPDATE family_invitations
      SET
        accepted = 1
      WHERE
        token = ?
    `).run(token);

    return res.json({success: true, message: 'Invitation accepted'});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({success: false, error: 'Invalid request'});
    }
    return res
      .status(asError(error).status ?? 500)
      .json({success: false, error: asError(error).message || 'Server error'});
  }
});
