import express from 'express';
import {z} from 'zod';
import {
  CreateFamilySchema,
  FamilySchema,
  CreateChildSchema,
  FamilyMemberSchema,
  SessionRowSchema,
  RoleRowSchema,
  IdRowSchema,
  IdParamSchema,
  asError,
} from '@gitterdun/shared';
import bcrypt from 'bcryptjs';
import db from '../lib/db';
import {sql} from '../utils/sql';

const router = express.Router();

// Helper: require auth via session cookie
const getCookie = (req: express.Request, name: string): string | undefined => {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader == null) {
    return undefined;
  }
  const cookieString = Array.isArray(cookieHeader)
    ? cookieHeader.join(';')
    : cookieHeader;
  const cookies = cookieString
    .split(';')
    .reduce<Record<string, string>>((acc, part) => {
      const [rawKey, ...rest] = part.trim().split('=');
      if (rawKey == null) {
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
  if (sid == null) {
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
    sessionRow != null ? SessionRowSchema.parse(sessionRow) : undefined;
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

// POST /api/families - create a family; creator becomes owner and parent member
router.post('/', (req, res) => {
  try {
    const userId = requireUserId(req);
    const {name} = CreateFamilySchema.parse(req.body);

    const familyRow = db
      .prepare(sql`
        INSERT INTO
          families (name, owner_id)
        VALUES
          (?, ?) RETURNING id,
          name,
          owner_id,
          created_at
      `)
      .get(name, userId);

    const family = FamilySchema.parse(familyRow);

    db.prepare(sql`
      INSERT INTO
        family_members (family_id, user_id, role)
      VALUES
        (?, ?, ?)
    `).run(family.id, userId, 'parent');

    return res.status(201).json({success: true, data: family});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({success: false, error: 'Invalid request'});
    }
    return res
      .status(asError(error).status ?? 500)
      .json({success: false, error: asError(error).message || 'Server error'});
  }
});

// GET /api/families/:id/members - list members
router.get('/:id/members', (req, res) => {
  try {
    const userId = requireUserId(req);
    const {id: familyId} = IdParamSchema.parse(req.params);
    const isMember = db
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
    if (isMember == null) {
      return res.status(403).json({success: false, error: 'Forbidden'});
    }

    const rows = db
      .prepare(sql`
        SELECT
          fm.family_id,
          fm.user_id,
          fm.role,
          u.username,
          u.email
        FROM
          family_members fm
          JOIN users u ON u.id = fm.user_id
        WHERE
          fm.family_id = ?
      `)
      .all(familyId);
    const data = rows.map(r => FamilyMemberSchema.parse(r));
    return res.json({success: true, data});
  } catch (error) {
    return res
      .status(asError(error).status ?? 500)
      .json({success: false, error: asError(error).message || 'Server error'});
  }
});

// POST /api/families/:id/children - owner or parent creates a child account directly
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.post('/:id/children', async (req, res) => {
  try {
    const userId = requireUserId(req);
    const {id: familyId} = IdParamSchema.parse(req.params);
    const {username, email, password} = CreateChildSchema.parse(req.body);

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
      membershipRow != null ? RoleRowSchema.parse(membershipRow) : undefined;
    if (!membership || membership.role !== 'parent') {
      return res.status(403).json({success: false, error: 'Forbidden'});
    }

    const existing = db
      .prepare(sql`
        SELECT
          1
        FROM
          users
        WHERE
          email = ?
          OR username = ?
      `)
      .get(email, username);
    if (existing != null) {
      return res.status(409).json({success: false, error: 'User exists'});
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userRow = db
      .prepare(sql`
        INSERT INTO
          users (username, email, password_hash, role)
        VALUES
          (?, ?, ?, 'user') RETURNING id
      `)
      .get(username, email, passwordHash);
    const user = IdRowSchema.parse(userRow);

    db.prepare(sql`
      INSERT INTO
        family_members (family_id, user_id, role)
      VALUES
        (?, ?, ?)
    `).run(familyId, user.id, 'child');

    return res.status(201).json({success: true, message: 'Child created'});
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

// GET /api/families/mine - list families where current user is a member
router.get('/mine', (req, res) => {
  try {
    const userId = requireUserId(req);
    const rows = db
      .prepare(sql`
        SELECT
          f.id,
          f.name,
          f.owner_id,
          f.created_at
        FROM
          families f
          JOIN family_members fm ON fm.family_id = f.id
        WHERE
          fm.user_id = ?
        ORDER BY
          f.created_at DESC
      `)
      .all(userId);
    const families = rows.map(r => FamilySchema.parse(r));
    return res.json({success: true, data: families});
  } catch (error) {
    return res
      .status(asError(error).status ?? 500)
      .json({success: false, error: asError(error).message || 'Server error'});
  }
});
