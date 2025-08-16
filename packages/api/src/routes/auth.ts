import express from 'express';
import bcrypt from 'bcryptjs';
import {
  LoginSchema,
  CreateUserSchema,
  UserSchema,
  UserWithPasswordRowSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordSchema,
  SessionRowSchema,
  IdRowSchema,
  PasswordResetRowSchema,
  asError,
} from '@gitterdun/shared';
import {z} from 'zod';
import crypto from 'node:crypto';
import db from '../lib/db';
import {logger} from '../utils/logger';
import {sql} from '../utils/sql';

const router = express.Router();

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
      if (rawKey == null || !rawKey) {
        return acc;
      }
      const key = decodeURIComponent(rawKey);
      const value = decodeURIComponent(rest.join('=') || '');
      acc[key] = value;
      return acc;
    }, {});
  return cookies[name];
};

// Helper to create a session
const createSession = (userId: number) => {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7); // 7 days

  db.prepare(sql`
    INSERT INTO
      sessions (id, user_id, created_at, expires_at)
    VALUES
      (?, ?, CURRENT_TIMESTAMP, ?)
  `).run(sessionId, userId, expiresAt.toISOString());

  return {sessionId, expiresAt};
};

const getUserFromSession = (req: express.Request) => {
  const sessionId = getCookie(req, 'sid');
  if (sessionId == null) {
    return null;
  }
  const sessionRow = db
    .prepare(sql`
      SELECT
        s.user_id AS user_id,
        s.expires_at AS expires_at
      FROM
        sessions s
      WHERE
        s.id = ?
    `)
    .get(sessionId);
  const session =
    sessionRow != null ? SessionRowSchema.parse(sessionRow) : undefined;

  if (!session) {
    return null;
  }
  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare(sql`
      DELETE FROM sessions
      WHERE
        id = ?
    `).run(sessionId);
    return null;
  }

  const user = db
    .prepare(sql`
      SELECT
        id,
        username,
        email,
        role,
        points,
        streak_count,
        created_at,
        updated_at
      FROM
        users
      WHERE
        id = ?
    `)
    .get(session.user_id);
  if (user == null) {
    return null;
  }
  return UserSchema.parse(user);
};

// POST /api/auth/login - User login
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const validatedBody = LoginSchema.parse(req.body);
    const {email, password} = validatedBody;

    // Query user from database
    const userRow = db
      .prepare(sql`
        SELECT
          id,
          username,
          email,
          password_hash,
          role,
          points,
          streak_count,
          created_at,
          updated_at
        FROM
          users
        WHERE
          email = ?
      `)
      .get(email);
    const user =
      userRow != null ? UserWithPasswordRowSchema.parse(userRow) : undefined;

    if (!user) {
      return res
        .status(401)
        .json({success: false, error: 'Invalid credentials'});
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res
        .status(401)
        .json({success: false, error: 'Invalid credentials'});
    }

    // Create session
    const {sessionId, expiresAt} = createSession(user.id);

    // Set cookie (httpOnly for security; sameSite lax for simplicity here)
    res.cookie('sid', sessionId, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    const validatedUser = UserSchema.parse({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      points: user.points,
      streak_count: user.streak_count,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });

    logger.info(`User logged in: ${email}`);

    return res.json({
      success: true,
      data: validatedUser,
      message: 'Login successful',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({error}, 'Login validation error');
      return res
        .status(400)
        .json({success: false, error: 'Invalid request data', details: error});
    }

    logger.error({error: asError(error)}, 'Login error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// POST /api/auth/register - Parent self-registration and family creation optional later
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const validatedBody = CreateUserSchema.parse(req.body);
    const {username, email, password, role = 'user'} = validatedBody;

    // Check if user already exists
    const existingUser = db
      .prepare(sql`
        SELECT
          id
        FROM
          users
        WHERE
          email = ?
          OR username = ?
      `)
      .get(email, username);

    if (existingUser != null) {
      return res
        .status(409)
        .json({
          success: false,
          error: 'User with this email or username already exists',
        });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = db
      .prepare(sql`
        INSERT INTO
          users (username, email, password_hash, role)
        VALUES
          (?, ?, ?, ?) RETURNING id,
          username,
          email,
          role,
          points,
          streak_count,
          created_at,
          updated_at
      `)
      .get(username, email, passwordHash, role);

    const validatedUser = UserSchema.parse(result);

    logger.info(`New user registered: ${email}`);

    return res
      .status(201)
      .json({
        success: true,
        data: validatedUser,
        message: 'User registered successfully',
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({error}, 'Registration validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid request data',
          details: error.stack,
        });
    }

    logger.error({error: asError(error)}, 'Registration error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// POST /api/auth/logout - Invalidate session
router.post('/logout', (req, res) => {
  try {
    const sessionId = getCookie(req, 'sid');
    if (sessionId != null) {
      db.prepare(sql`
        DELETE FROM sessions
        WHERE
          id = ?
      `).run(sessionId);
    }
    res.clearCookie('sid', {path: '/'});
    return res.json({success: true, message: 'Logged out'});
  } catch (error) {
    logger.error({error: asError(error)}, 'Logout error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// GET /api/auth/me - Current user
router.get('/me', (req, res) => {
  try {
    const user = getUserFromSession(req);
    if (!user) {
      return res.status(401).json({success: false, error: 'Not authenticated'});
    }
    return res.json({success: true, data: user});
  } catch (error) {
    logger.error({error: asError(error)}, 'Me error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// POST /api/auth/forgot - request password reset
router.post('/forgot', (req, res) => {
  try {
    const {email} = ForgotPasswordRequestSchema.parse(req.body);
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
    const user = row != null ? IdRowSchema.parse(row) : undefined;

    // Always respond with success to prevent enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
    db.prepare(sql`
      INSERT INTO
        password_resets (token, user_id, created_at, expires_at, used)
      VALUES
        (?, ?, CURRENT_TIMESTAMP, ?, 0)
    `).run(token, user.id, expiresAt.toISOString());

    // In a real app, send email. For now, log the token.
    logger.info({email, token}, 'Password reset requested');

    return res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({success: false, error: 'Invalid request data'});
    }
    logger.error({error: asError(error)}, 'Forgot password error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// POST /api/auth/reset - reset password
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.post('/reset', async (req, res) => {
  try {
    const {token, password} = ResetPasswordSchema.parse(req.body);
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
    const found = row != null ? PasswordResetRowSchema.parse(row) : undefined;

    if (!found || found.used) {
      return res.status(400).json({success: false, error: 'Invalid token'});
    }
    if (new Date(found.expires_at).getTime() < Date.now()) {
      return res.status(400).json({success: false, error: 'Token expired'});
    }

    const hashed = await bcrypt.hash(password, 12);
    db.prepare(sql`
      UPDATE users
      SET
        password_hash = ?
      WHERE
        id = ?
    `).run(hashed, found.user_id);
    db.prepare(sql`
      UPDATE password_resets
      SET
        used = 1
      WHERE
        token = ?
    `).run(token);

    return res.json({success: true, message: 'Password has been reset'});
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({success: false, error: 'Invalid request data'});
    }
    logger.error({error: asError(error)}, 'Reset password error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

export default router;
