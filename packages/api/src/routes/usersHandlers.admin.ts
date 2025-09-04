import type express from 'express';
import {StatusCodes} from 'http-status-codes';
import {z} from 'zod';
import {logger} from '../utils/logger';
import {UserSchema, asError} from '@gitterdun/shared';
import {requireAdmin} from './usersAuth';
import {
  clearChoresCreatedBy,
  deleteInvitationsByInviter,
  deleteUserById,
  listUsers,
} from '../utils/crud/users';

export const listUsersHandler = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    const rows = await listUsers();
    const users = rows.map(row => UserSchema.parse(row));
    res.json({success: true, data: users});
  } catch (error) {
    logger.error({error: asError(error)}, 'List users error');
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: 'Internal server error'});
  }
};

export const deleteUserHandler = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  try {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    const id = z.coerce.number().int().parse(req.params['id']);

    await clearChoresCreatedBy(id);
    await deleteInvitationsByInviter(id);
    const info = await deleteUserById(id);
    if (info.changes === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({success: false, error: 'User not found'});
      return;
    }
    res.json({success: true});
  } catch (error) {
    logger.error({error: asError(error)}, 'Delete user error');
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: 'Internal server error'});
  }
};
