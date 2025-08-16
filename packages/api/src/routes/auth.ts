import express from 'express';
import type {Response} from 'express';
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

type UserWithPasswordRow = z.infer<typeof UserWithPasswordRowSchema>;

const router = express.Router();

const parseCookieString = (cookieString: string): Record<string, string> => {
  return cookieString.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rest] = part.trim().split('=');
    if (!rawKey) {
      return acc;
    }
    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rest.join('=') || '');
    acc[key] = value;
    return acc;
  }, {});
};

const getCookie = (req: express.Request, name: string): string | undefined => {
  const cookieHeader = req.headers.cookie;
  if (cookieHeader === undefined) {
    return undefined;
  }
  const cookieString = Array.isArray(cookieHeader)
    ? cookieHeader.join(';')
    : cookieHeader;
  if (!cookieString) {
    return undefined;
  }
  const cookies = parseCookieString(cookieString);
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

// Helper function to validate session
const validateSession = (sessionId: string) => {
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
    sessionRow === null ? undefined : SessionRowSchema.parse(sessionRow);

  if (!session) {
    return null;
  }

  // Check if session is expired
  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare(sql`
      DELETE FROM sessions
      WHERE
        id = ?
    `).run(sessionId);
    return null;
  }

  return session;
};

// Helper function to get user by ID
const getUserById = (userId: number) => {
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
    .get(userId);
  return user === undefined ? null : UserSchema.parse(user);
};

const getUserFromSession = (req: express.Request) => {
  const sessionId = getCookie(req, 'sid');
  if (sessionId === undefined) {
    return null;
  }

  const session = validateSession(sessionId);
  if (!session) {
    return null;
  }

  return getUserById(session.user_id);
};

// POST /api/auth/login - User login
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
// Helper function to find user by email
const findUserByEmail = (email: string) => {
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
  return userRow === null
    ? undefined
    : UserWithPasswordRowSchema.parse(userRow);
};

// Helper function to set session cookie
const setSessionCookie = (
  res: Response,
  sessionId: string,
  expiresAt: Date,
) => {
  res.cookie('sid', sessionId, {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
};

// Helper function to prepare user response data
const prepareUserResponse = (user: UserWithPasswordRow) => {
  return UserSchema.parse({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    points: user.points,
    streak_count: user.streak_count,
    created_at: user.created_at,
    updated_at: user.updated_at,
  });
};

const verifyUserPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

const createLoginSession = (res: Response, userId: number) => {
  const {sessionId, expiresAt} = createSession(userId);
  setSessionCookie(res, sessionId, expiresAt);
  return {sessionId, expiresAt};
};

const prepareLoginResponse = (user: UserWithPasswordRow, email: string) => {
  const validatedUser = prepareUserResponse(user);
  logger.info(`User logged in: ${email}`);
  return {success: true, data: validatedUser, message: 'Login successful'};
};

router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const validatedBody = LoginSchema.parse(req.body);
    const {email, password} = validatedBody;

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({success: false, error: 'Invalid credentials'});
    }

    // Verify password
    const isValidPassword = await verifyUserPassword(
      password,
      user.password_hash,
    );
    if (!isValidPassword) {
      return res
        .status(401)
        .json({success: false, error: 'Invalid credentials'});
    }

    // Create session and prepare response
    createLoginSession(res, user.id);
    const response = prepareLoginResponse(user, email);
    return res.json(response);
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
// Helper function to check if user already exists
const checkUserExists = (email: string, username: string) => {
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
  return existingUser !== null;
};

// Helper function to create new user
const createNewUser = async (
  username: string,
  email: string,
  password: string,
  role: string,
) => {
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

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

  return UserSchema.parse(result);
};

router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const validatedBody = CreateUserSchema.parse(req.body);
    const {username, email, password, role = 'user'} = validatedBody;

    // Check if user already exists
    if (checkUserExists(email, username)) {
      return res
        .status(409)
        .json({
          success: false,
          error: 'User with this email or username already exists',
        });
    }

    // Create new user
    const validatedUser = await createNewUser(username, email, password, role);
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
    if (sessionId !== undefined) {
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

// Helper function to create password reset token
const createPasswordResetToken = (userId: number) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
  db.prepare(sql`
    INSERT INTO
      password_resets (token, user_id, created_at, expires_at, used)
    VALUES
      (?, ?, CURRENT_TIMESTAMP, ?, 0)
  `).run(token, userId, expiresAt.toISOString());
  return token;
};

const findUserForReset = (email: string) => {
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

const handlePasswordResetRequest = (email: string, userId: number) => {
  const token = createPasswordResetToken(userId);
  // In a real app, send email. For now, log the token.
  logger.info({email, token}, 'Password reset requested');
  return {
    success: true,
    message: 'If the email exists, a reset link has been sent',
  };
};

// POST /api/auth/forgot - request password reset
router.post('/forgot', (req, res) => {
  try {
    const {email} = ForgotPasswordRequestSchema.parse(req.body);
    const user = findUserForReset(email);

    // Always respond with success to prevent enumeration
    const response = {
      success: true,
      message: 'If the email exists, a reset link has been sent',
    };

    if (!user) {
      return res.json(response);
    }

    const resetResponse = handlePasswordResetRequest(email, user.id);
    return res.json(resetResponse);
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
// Helper function to validate password reset token
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

// Helper function to reset user password
const resetUserPassword = async (
  userId: number,
  password: string,
  token: string,
) => {
  const hashed = await bcrypt.hash(password, 12);
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

router.post('/reset', async (req, res) => {
  try {
    const {token, password} = ResetPasswordSchema.parse(req.body);

    const validation = validatePasswordResetToken(token);
    if (!validation.isValid) {
      return res.status(400).json({success: false, error: validation.error});
    }

    await resetUserPassword(validation.resetData!.user_id, password, token);
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
