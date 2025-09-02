import type express from 'express';
import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils/logger';
import {UserSchema, UpdateUserSchema, asError} from '@gitterdun/shared';
import {getUserFromSession} from '../utils/sessionUtils';
import {
  clearChoresCreatedBy,
  deleteInvitationsByInviter,
  deleteUserById,
  getUserById,
  updateUserProfile,
} from '../utils/crud/users';

// Admin-only handlers
export {listUsersHandler, deleteUserHandler} from './usersHandlers.admin';

export const getMeHandler = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const sessionUser = getUserFromSession(req);
    if (!sessionUser) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({success: false, error: 'Not authenticated'});
      return;
    }
    const user = UserSchema.parse(sessionUser);
    res.json({success: true, data: user});
  } catch (error) {
    logger.error({error: asError(error)}, 'Get profile error');
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: 'Internal server error'});
  }
};

export const patchMeHandler = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const sessionUser = getUserFromSession(req);
    if (!sessionUser) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({success: false, error: 'Not authenticated'});
      return;
    }
    const user = UserSchema.parse(sessionUser);
    const parsed = UpdateUserSchema.pick({
      display_name: true,
      avatar_url: true,
      email: true,
    }).parse(req.body);

    const nextDisplayName = parsed.display_name ?? user.display_name ?? null;
    const nextAvatarUrl = parsed.avatar_url ?? user.avatar_url ?? null;
    const nextEmail = parsed.email ?? user.email ?? null;

    const info = updateUserProfile(
      user.id,
      nextDisplayName,
      nextAvatarUrl,
      nextEmail,
    );

    if (info.changes === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({success: false, error: 'User not found'});
      return;
    }

    const updated = getUserById(user.id);

    res.json({success: true, data: UserSchema.parse(updated)});
  } catch (error) {
    logger.error({error: asError(error)}, 'Update profile error');
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: 'Internal server error'});
  }
};

export const deleteMeHandler = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const sessionUser = getUserFromSession(req);
    if (!sessionUser) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({success: false, error: 'Not authenticated'});
      return;
    }
    const user = UserSchema.parse(sessionUser);

    clearChoresCreatedBy(user.id);
    deleteInvitationsByInviter(user.id);
    const info = deleteUserById(user.id);

    if (info.changes === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({success: false, error: 'User not found'});
      return;
    }
    res.clearCookie('sid', {path: '/'});
    res.json({success: true});
  } catch (error) {
    logger.error({error: asError(error)}, 'Delete self error');
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: 'Internal server error'});
  }
};
