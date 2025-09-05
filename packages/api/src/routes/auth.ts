import express from 'express';
import type {
  RequestWithBody,
  TypedResponse,
  RequestDefault,
} from '../types/http';
import {StatusCodes} from 'http-status-codes';
import type {
  Login,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@gitterdun/shared';
import {
  LoginSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordSchema,
  asError,
} from '@gitterdun/shared';
import {logger} from '../utils/logger';

import {getCookie} from '../utils/cookieUtils';
import {getUserFromSession, deleteSession} from '../utils/sessionUtils';
import {
  authenticateUser,
  createLoginSession,
  prepareLoginResponse,
  validateRegistrationData,
  createNewUser,
} from '../utils/userAuthUtils';
import {
  findUserForReset,
  getSecuritySafeResponse,
  handlePasswordResetRequest,
  validateResetToken,
  resetUserPassword,
} from '../utils/passwordResetUtils';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

router.post(
  '/login',
  async (req: RequestWithBody<Login>, res: TypedResponse) => {
    const parsed = LoginSchema.parse(req.body);
    const user = await authenticateUser(parsed, parsed.password);

    await createLoginSession(res, user.id);
    const identifier = 'email' in parsed ? parsed.email : parsed.username;
    const response = prepareLoginResponse(user, identifier);
    res.json(response);
  },
);

// POST /api/auth/register - Parent self-registration and family creation optional later

router.post(
  '/register',
  async (req: RequestWithBody<unknown>, res: TypedResponse) => {
    const {username, email, password, role} = await validateRegistrationData(
      req.body,
    );
    const validatedUser = await createNewUser(
      email !== undefined
        ? {username, email, password, role}
        : {username, password, role},
    );

    // Automatically log in the user after successful registration
    await createLoginSession(res, validatedUser.id);

    logger.info(`New user registered: ${username}`);
    res
      .status(StatusCodes.CREATED)
      .json({
        success: true,
        data: validatedUser,
        message: 'User registered successfully',
      });
  },
);

// POST /api/auth/logout - Invalidate session
router.post('/logout', async (req: RequestDefault, res: TypedResponse) => {
  try {
    const sessionId = getCookie(req, 'sid');
    if (sessionId !== undefined) {
      await deleteSession(sessionId);
    }
    res.clearCookie('sid', {path: '/'});
    return res.json({success: true, message: 'Logged out'});
  } catch (error) {
    logger.error({error: asError(error)}, 'Logout error');
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: 'Internal server error'});
  }
});

// GET /api/auth/me - Current user
router.get('/me', async (req: RequestDefault, res: TypedResponse) => {
  try {
    const user = await getUserFromSession(req);
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({success: false, error: 'Not authenticated'});
    }
    return res.json({success: true, data: user});
  } catch (error) {
    logger.error({error: asError(error)}, 'Me error');
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: 'Internal server error'});
  }
});

// POST /api/auth/forgot - request password reset
router.post(
  '/forgot',
  async (req: RequestWithBody<ForgotPasswordRequest>, res: TypedResponse) => {
    const {email} = ForgotPasswordRequestSchema.parse(req.body);
    const user = await findUserForReset(email);
    const response = getSecuritySafeResponse();

    if (!user) {
      res.json(response);
      return;
    }

    const resetResponse = await handlePasswordResetRequest(email, user.id);
    res.json(resetResponse);
  },
);

// POST /api/auth/reset - reset password

router.post(
  '/reset',
  async (req: RequestWithBody<ResetPasswordRequest>, res: TypedResponse) => {
    const {token, password} = ResetPasswordSchema.parse(req.body);
    const resetData = await validateResetToken(token);

    await resetUserPassword(resetData.user_id, password, token);
    res.json({success: true, message: 'Password has been reset'});
  },
);

export default router;
