import type {
  RequestWithParams,
  TypedResponse,
  RequestDefault,
} from '../types/http.js';
import {IdParamSchema, asError, OutgoingUserSchema} from '@gitterdun/shared';
import {StatusCodes} from 'http-status-codes';
// zod import removed; using shared IdParamSchema
import {logger} from '../utils/logger.js';
import {requireAdmin} from './usersAuth.js';
import {
  clearChoresCreatedBy,
  deleteInvitationsByInviter,
  deleteUserById,
  listUsers,
} from '../utils/crud/users.js';

export const listUsersHandler = async (
  req: RequestDefault,
  res: TypedResponse,
): Promise<void> => {
  try {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    const rows = await listUsers();
    const users = rows.map(user => OutgoingUserSchema.parse(user));
    res.json({success: true, data: users});
  } catch (error) {
    logger.error({error: asError(error)}, 'List users error');
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: 'Internal server error'});
  }
};

export const deleteUserHandler = async (
  req: RequestWithParams<{id: string}>,
  res: TypedResponse,
): Promise<void> => {
  try {
    if (!(await requireAdmin(req, res))) {
      return;
    }
    const {id} = IdParamSchema.parse(req.params);

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
