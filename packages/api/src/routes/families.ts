import express from 'express';
import {z} from 'zod';
import {
  CreateFamilySchema,
  FamilySchema,
  CreateChildSchema,
  FamilyMemberSchema,
  RoleRowSchema,
  IdRowSchema,
  IdParamSchema,
  asError,
} from '@gitterdun/shared';
import bcrypt from 'bcryptjs';
import db from '../lib/db';
import {sql} from '../utils/sql';
import {requireUserId} from '../utils/auth';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

// Authentication utility moved to ../utils/auth

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
    if (isMember === undefined) {
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
    const data = rows.map(row => FamilyMemberSchema.parse(row));
    return res.json({success: true, data});
  } catch (error) {
    return res
      .status(asError(error).status ?? 500)
      .json({success: false, error: asError(error).message || 'Server error'});
  }
});

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

const checkUserExists = (email: string, username: string): boolean => {
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
  return existing !== undefined;
};

const createChildUser = async (
  username: string,
  email: string,
  password: string,
): Promise<number> => {
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
  return user.id;
};

const addChildToFamily = (familyId: number, childId: number): void => {
  db.prepare(sql`
    INSERT INTO
      family_members (family_id, user_id, role)
    VALUES
      (?, ?, ?)
  `).run(familyId, childId, 'child');
};

const handleRouteError = (
  res: express.Response,
  error: unknown,
): express.Response => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({success: false, error: 'Invalid request'});
  }
  return res
    .status(asError(error).status ?? 500)
    .json({success: false, error: asError(error).message || 'Server error'});
};

type CreateChildRequest = {
  userId: number;
  familyId: number;
  username: string;
  email: string;
  password: string;
};

const parseCreateChildRequest = (req: express.Request): CreateChildRequest => {
  const userId = requireUserId(req);
  const {id: familyId} = IdParamSchema.parse(req.params);
  const {username, email, password} = CreateChildSchema.parse(req.body);
  return {userId, familyId, username, email, password};
};

// POST /api/families/:id/children - owner or parent creates a child account directly
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.post('/:id/children', async (req, res) => {
  try {
    const {userId, familyId, username, email, password} =
      parseCreateChildRequest(req);

    validateParentMembership(userId, familyId);

    if (checkUserExists(email, username)) {
      return res.status(409).json({success: false, error: 'User exists'});
    }

    const childId = await createChildUser(username, email, password);
    addChildToFamily(familyId, childId);

    return res.status(201).json({success: true, message: 'Child created'});
  } catch (error) {
    return handleRouteError(res, error);
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
    const families = rows.map(row => FamilySchema.parse(row));
    return res.json({success: true, data: families});
  } catch (error) {
    return res
      .status(asError(error).status ?? 500)
      .json({success: false, error: asError(error).message || 'Server error'});
  }
});
