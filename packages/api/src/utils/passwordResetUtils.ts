import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import {IdRowSchema, PasswordResetRowSchema} from '@gitterdun/shared';
import db from '../lib/db';
import {logger} from './logger';
import {sql} from './sql';
import {
  BCRYPT_SALT_ROUNDS,
  SECURE_TOKEN_BYTES,
  PASSWORD_RESET_EXPIRATION_MS,
} from '../constants';

const createPasswordResetToken = (userId: number) => {
  const token = crypto.randomBytes(SECURE_TOKEN_BYTES).toString('hex');
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRATION_MS);
  db.prepare(sql`
    INSERT INTO
      password_resets (token, user_id, created_at, expires_at, used)
    VALUES
      (?, ?, CURRENT_TIMESTAMP, ?, 0)
  `).run(token, userId, expiresAt.toISOString());
  return token;
};

export const findUserForReset = (email: string) => {
  const row = db
    .prepare(sql`
      SELECT
        id
      FROM
        users
      WHERE
        email = ?
    `)
    .get(email);
  return row === null ? undefined : IdRowSchema.parse(row);
};

export const handlePasswordResetRequest = (email: string, userId: number) => {
  const token = createPasswordResetToken(userId);
  // In a real app, send email. For now, log the token.
  logger.info({email, token}, 'Password reset requested');
  return {
    success: true,
    message: 'If the email exists, a reset link has been sent',
  };
};

export const getSecuritySafeResponse = () => ({
  success: true,
  message: 'If the email exists, a reset link has been sent',
});

const validatePasswordResetToken = (token: string) => {
  const row = db
    .prepare(sql`
      SELECT
        token,
        user_id,
        expires_at,
        used
      FROM
        password_resets
      WHERE
        token = ?
    `)
    .get(token);
  const found = row === null ? undefined : PasswordResetRowSchema.parse(row);

  if (!found || found.used) {
    return {isValid: false, error: 'Invalid token'};
  }
  if (new Date(found.expires_at).getTime() < Date.now()) {
    return {isValid: false, error: 'Token expired'};
  }

  return {isValid: true, resetData: found};
};

export const resetUserPassword = async (
  userId: number,
  password: string,
  token: string,
) => {
  const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  db.prepare(sql`
    UPDATE users
    SET
      password_hash = ?
    WHERE
      id = ?
  `).run(hashed, userId);
  db.prepare(sql`
    UPDATE password_resets
    SET
      used = 1
    WHERE
      token = ?
  `).run(token);
};

export const validateResetToken = (token: string) => {
  const validation = validatePasswordResetToken(token);
  if (!validation.isValid || !validation.resetData) {
    const errorMessage = validation.error ?? 'Invalid token';
    throw Object.assign(new Error(errorMessage), {status: 400});
  }
  return validation.resetData;
};
