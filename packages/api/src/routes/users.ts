import express from 'express';
import {
  listUsersHandler,
  deleteUserHandler,
  getMeHandler,
  patchMeHandler,
  deleteMeHandler,
} from './usersHandlers';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

router.get('/', listUsersHandler);

router.delete('/:id', deleteUserHandler);

// GET /api/users/me - current user's profile
router.get('/me', getMeHandler);

// PATCH /api/users/me - update display name, email, or avatar URL
router.patch('/me', patchMeHandler);

// DELETE /api/users/me - delete the current user's account
router.delete('/me', deleteMeHandler);

export default router;
