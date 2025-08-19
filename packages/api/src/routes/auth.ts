import express from 'express';
import {
  LoginSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordSchema,
  asError,
} from '@gitterdun/shared';
import {logger} from '../utils/logger';
import {handleRouteError} from '../utils/errorHandling';
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

// eslint-disable-next-line @typescript-eslint/no-misused-promises -- properly handled with try-catch
router.post('/login', async (req, res) => {
  try {
    const {email, password} = LoginSchema.parse(req.body);
    const user = await authenticateUser(email, password);

    createLoginSession(res, user.id);
    const response = prepareLoginResponse(user, email);
    return res.json(response);
  } catch (error) {
    return handleRouteError(res, error, 'Login');
  }
});

// POST /api/auth/register - Parent self-registration and family creation optional later

// eslint-disable-next-line @typescript-eslint/no-misused-promises -- properly handled with try-catch
router.post('/register', async (req, res) => {
  try {
    const {username, email, password, role} = validateRegistrationData(
      req.body,
    );
    const validatedUser = await createNewUser({
      username,
      email,
      password,
      role,
    });

    logger.info(`New user registered: ${email}`);
    return res
      .status(201)
      .json({
        success: true,
        data: validatedUser,
        message: 'User registered successfully',
      });
  } catch (error) {
    return handleRouteError(res, error, 'Registration');
  }
});

// POST /api/auth/logout - Invalidate session
router.post('/logout', (req, res) => {
  try {
    const sessionId = getCookie(req, 'sid');
    if (sessionId !== undefined) {
      deleteSession(sessionId);
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
    const user = findUserForReset(email);
    const response = getSecuritySafeResponse();

    if (!user) {
      return res.json(response);
    }

    const resetResponse = handlePasswordResetRequest(email, user.id);
    return res.json(resetResponse);
  } catch (error) {
    return handleRouteError(res, error, 'Forgot password');
  }
});

// POST /api/auth/reset - reset password

// eslint-disable-next-line @typescript-eslint/no-misused-promises -- properly handled with try-catch
router.post('/reset', async (req, res) => {
  try {
    const {token, password} = ResetPasswordSchema.parse(req.body);
    const resetData = validateResetToken(token);

    await resetUserPassword(resetData.user_id, password, token);
    return res.json({success: true, message: 'Password has been reset'});
  } catch (error) {
    return handleRouteError(res, error, 'Reset password');
  }
});

export default router;
