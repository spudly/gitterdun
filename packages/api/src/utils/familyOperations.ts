import express from 'express';
import {z} from 'zod';
import {
  FamilySchema,
  FamilyMemberSchema,
  IdRowSchema,
  asError,
} from '@gitterdun/shared';
import bcrypt from 'bcryptjs';
import db from '../lib/db';
import {sql} from './sql';

export const createFamily = (name: string, userId: number) => {
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

  return family;
};

export const getFamilyMembers = (familyId: number) => {
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
  return rows.map(row => FamilyMemberSchema.parse(row));
};

export const getUserFamilies = (userId: number) => {
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
  return rows.map(row => FamilySchema.parse(row));
};

export const checkUserExists = (email: string, username: string): boolean => {
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

export const createChildUser = async (
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

export const addChildToFamily = (familyId: number, childId: number): void => {
  db.prepare(sql`
    INSERT INTO
      family_members (family_id, user_id, role)
    VALUES
      (?, ?, ?)
  `).run(familyId, childId, 'child');
};

export const handleRouteError = (
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
