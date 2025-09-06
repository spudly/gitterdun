import type {
  RequestWithBody,
  TypedResponse,
  RequestDefault,
} from '../types/http.js';
import {StatusCodes} from 'http-status-codes';
import {logger} from '../utils/logger.js';
import {OutgoingUserSchema, UpdateUserSchema, asError} from '@gitterdun/shared';
import {getUserFromSession} from '../utils/sessionUtils.js';
import {
  clearChoresCreatedBy,
  deleteInvitationsByInviter,
  deleteUserById,
  getUserById,
  updateUserProfile,
} from '../utils/crud/users.js';

// Admin-only handlers
export {listUsersHandler, deleteUserHandler} from './usersHandlers.admin.js';

export const getMeHandler = async (
  req: RequestDefault,
  res: TypedResponse,
): Promise<void> => {
  try {
    const sessionUser = await getUserFromSession(req);
    if (!sessionUser) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({success: false, error: 'Not authenticated'});
      return;
    }
    const user = OutgoingUserSchema.parse(sessionUser);
    res.json({success: true, data: user});
  } catch (error) {
    logger.error({error: asError(error)}, 'Get profile error');
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: 'Internal server error'});
  }
};

export const patchMeHandler = async (
  req: RequestWithBody<unknown>,
  res: TypedResponse,
): Promise<void> => {
  try {
    const sessionUser = await getUserFromSession(req);
    if (!sessionUser) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({success: false, error: 'Not authenticated'});
      return;
    }
    const parsed = UpdateUserSchema.pick({
      display_name: true,
      avatar_url: true,
      email: true,
    }).parse(req.body);

    const nextDisplayName =
      parsed.display_name ?? sessionUser.display_name ?? null;
    const nextAvatarUrl = parsed.avatar_url ?? sessionUser.avatar_url ?? null;
    const nextEmail = parsed.email ?? sessionUser.email ?? null;

    const info = await updateUserProfile(
      sessionUser.id,
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

    const updated = await getUserById(sessionUser.id);
    if (!updated) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({success: false, error: 'User not found'});
      return;
    }

    res.json({success: true, data: OutgoingUserSchema.parse(updated)});
  } catch (error) {
    logger.error({error: asError(error)}, 'Update profile error');
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: 'Internal server error'});
  }
};

export const deleteMeHandler = async (
  req: RequestDefault,
  res: TypedResponse,
): Promise<void> => {
  try {
    const sessionUser = await getUserFromSession(req);
    if (!sessionUser) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({success: false, error: 'Not authenticated'});
      return;
    }
    await clearChoresCreatedBy(sessionUser.id);
    await deleteInvitationsByInviter(sessionUser.id);
    const info = await deleteUserById(sessionUser.id);

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
