import express from 'express';
import db from '../lib/db';
import crypto from 'crypto';
import {z} from 'zod';
import {
  CreateInvitationSchema,
  AcceptInvitationSchema,
} from '@gitterdun/shared';
import bcrypt from 'bcryptjs';

const router = express.Router();

const getCookie = (req: express.Request, name: string): string | undefined => {
  const cookieHeader = req.headers['cookie'];
  if (!cookieHeader) return undefined;
  const cookies = cookieHeader
    .split(';')
    .reduce<Record<string, string>>((acc, part) => {
      const [k, ...rest] = part.trim().split('=');
      acc[decodeURIComponent(k)] = decodeURIComponent(rest.join('='));
      return acc;
    }, {});
  return cookies[name];
};

const requireUserId = (req: express.Request): number => {
  const sid = getCookie(req, 'sid');
  if (!sid) throw Object.assign(new Error('Not authenticated'), {status: 401});
  const session = db
    .prepare('SELECT user_id, expires_at FROM sessions WHERE id = ?')
    .get(sid) as {user_id: number; expires_at: string} | undefined;
  if (!session) throw Object.assign(new Error('Not authenticated'), {status: 401});
  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sid);
    throw Object.assign(new Error('Session expired'), {status: 401});
  }
  return session.user_id;
};

// POST /api/invitations/:familyId - invite by email as parent or child
router.post('/:familyId', (req, res) => {
  try {
    const inviterId = requireUserId(req);
    const familyId = Number(req.params['familyId']);
    const {email, role} = CreateInvitationSchema.parse(req.body);

    const membership = db
      .prepare('SELECT role FROM family_members WHERE family_id = ? AND user_id = ?')
      .get(familyId, inviterId) as {role: 'parent' | 'child'} | undefined;
    if (!membership || membership.role !== 'parent') {
      return res.status(403).json({success: false, error: 'Forbidden'});
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
    db.prepare(
      `INSERT INTO family_invitations (token, family_id, email, role, invited_by, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(token, familyId, email, role, inviterId, expiresAt.toISOString());

    // Email sending would go here; return token for dev
    return res.json({success: true, message: 'Invitation created', token});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({success: false, error: 'Invalid request'});
    }
    return res
      .status((error as any).status || 500)
      .json({success: false, error: (error as any).message || 'Server error'});
  }
});

export default router;

// POST /api/invitations/accept - accept an invitation and create/link account
router.post('/accept', async (req, res) => {
  try {
    const {token, username, password} = AcceptInvitationSchema.parse(req.body);
    const inv = db
      .prepare(
        `SELECT token, family_id, email, role, invited_by, expires_at, accepted
         FROM family_invitations WHERE token = ?`,
      )
      .get(token) as
      | {
          token: string;
          family_id: number;
          email: string;
          role: 'parent' | 'child';
          invited_by: number;
          expires_at: string;
          accepted: number;
        }
      | undefined;

    if (!inv) return res.status(400).json({success: false, error: 'Invalid token'});
    if (inv.accepted) return res.status(400).json({success: false, error: 'Already used'});
    if (new Date(inv.expires_at).getTime() < Date.now()) {
      return res.status(400).json({success: false, error: 'Token expired'});
    }

    // If user exists by email, verify password; else create new user
    const existing = db
      .prepare('SELECT id, password_hash FROM users WHERE email = ?')
      .get(inv.email) as {id: number; password_hash: string} | undefined;

    let userId: number;
    if (existing) {
      const ok = await bcrypt.compare(password, existing.password_hash);
      if (!ok) return res.status(401).json({success: false, error: 'Invalid credentials'});
      userId = existing.id;
    } else {
      const hash = await bcrypt.hash(password, 12);
      const created = db
        .prepare(
          `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'user') RETURNING id`,
        )
        .get(username, inv.email, hash) as {id: number};
      userId = created.id;
    }

    // Add membership if not already
    const member = db
      .prepare('SELECT 1 FROM family_members WHERE family_id = ? AND user_id = ?')
      .get(inv.family_id, userId);
    if (!member) {
      db.prepare('INSERT INTO family_members (family_id, user_id, role) VALUES (?, ?, ?)').run(
        inv.family_id,
        userId,
        inv.role,
      );
    }

    db.prepare('UPDATE family_invitations SET accepted = 1 WHERE token = ?').run(token);

    return res.json({success: true, message: 'Invitation accepted'});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({success: false, error: 'Invalid request'});
    }
    return res
      .status((error as any).status || 500)
      .json({success: false, error: (error as any).message || 'Server error'});
  }
});

