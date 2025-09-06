import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import {IdRowSchema, PasswordResetRowSchema} from '@gitterdun/shared';
import {get, run} from './crud/db.js';
import {logger} from './logger.js';
import {sql} from './sql.js';
import {
  BCRYPT_SALT_ROUNDS,
  SECURE_TOKEN_BYTES,
  PASSWORD_RESET_EXPIRATION_MINUTES,
} from '../constants.js';
import {addMinutes, isPast} from 'date-fns';

const createPasswordResetToken = async (userId: number) => {
  const token = crypto.randomBytes(SECURE_TOKEN_BYTES).toString('hex');
  const expiresAt = addMinutes(new Date(), PASSWORD_RESET_EXPIRATION_MINUTES);
  await run(
    sql`
      INSERT INTO
        password_resets (token, user_id, created_at, expires_at, used)
      VALUES
        (?, ?, current_timestamp, ?, 0)
    `,
    token,
    userId,
    expiresAt.toISOString(),
  );
  return token;
};

export const findUserForReset = async (email: string) => {
  const row = await get(
    sql`
      SELECT
        id
      FROM
        users
      WHERE
        email = ?
    `,
    email,
  );
  return IdRowSchema.nullish().parse(row);
};

export const handlePasswordResetRequest = async (
  email: string,
  userId: number,
) => {
  const token = await createPasswordResetToken(userId);
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

const validatePasswordResetToken = async (token: string) => {
  const row = await get(
    sql`
      SELECT
        token,
        user_id,
        expires_at,
        used
      FROM
        password_resets
      WHERE
        token = ?
    `,
    token,
  );
  const found = PasswordResetRowSchema.nullish().parse(row);
  if (found == null || found.used === 1) {
    return {isValid: false, error: 'Invalid token'};
  }
  if (isPast(found.expires_at)) {
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
  await run(
    sql`
      UPDATE users
      SET
        password_hash = ?
      WHERE
        id = ?
    `,
    hashed,
    userId,
  );
  await run(
    sql`
      UPDATE password_resets
      SET
        used = 1
      WHERE
        token = ?
    `,
    token,
  );
};

export const validateResetToken = async (token: string) => {
  const validation = await validatePasswordResetToken(token);
  if (!validation.isValid || !validation.resetData) {
    const errorMessage = validation.error ?? 'Invalid token';
    throw Object.assign(new Error(errorMessage), {status: 400});
  }
  return validation.resetData;
};
