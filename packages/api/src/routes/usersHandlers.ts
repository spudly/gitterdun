import type express from 'express';
import {StatusCodes} from 'http-status-codes';
import db from '../lib/db';
import {sql} from '../utils/sql';
import {logger} from '../utils/logger';
import {UserSchema, UpdateUserSchema, asError} from '@gitterdun/shared';
import {getUserFromSession} from '../utils/sessionUtils';

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

    const info = db
      .prepare(sql`
        UPDATE users
        SET
          display_name = ?,
          avatar_url = ?,
          email = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE
          id = ?
      `)
      .run(nextDisplayName, nextAvatarUrl, nextEmail, user.id);

    if (info.changes === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({success: false, error: 'User not found'});
      return;
    }

    const updated = db
      .prepare(sql`
        SELECT
          id,
          username,
          email,
          role,
          points,
          streak_count,
          display_name,
          avatar_url,
          created_at,
          updated_at
        FROM
          users
        WHERE
          id = ?
      `)
      .get(user.id);

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

    db.prepare(sql`
      UPDATE chores
      SET
        created_by = NULL
      WHERE
        created_by = ?
    `).run(user.id);

    db.prepare(sql`
      DELETE FROM family_invitations
      WHERE
        invited_by = ?
    `).run(user.id);

    const info = db
      .prepare(sql`
        DELETE FROM users
        WHERE
          id = ?
      `)
      .run(user.id);

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
