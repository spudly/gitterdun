import express from 'express';
import {
  handleGetChores,
  handleCreateChore,
  handleGetChoreById,
  handleUpdateChore,
  handleDeleteChore,
  handleCompleteChore,
} from './choreHandlers';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

// GET /api/chores - Get all chores
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- properly handled with try-catch
router.get('/', handleGetChores);

// POST /api/chores - Create a new chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- properly handled with try-catch
router.post('/', handleCreateChore);

// GET /api/chores/:id - Get a specific chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- properly handled with try-catch
router.get('/:id', handleGetChoreById);

// PUT /api/chores/:id - Update a chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- properly handled with try-catch
router.put('/:id', handleUpdateChore);

// DELETE /api/chores/:id - Delete a chore
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- properly handled with try-catch
router.delete('/:id', handleDeleteChore);

// POST /api/chores/:id/complete - Mark a chore as completed
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- properly handled with try-catch
router.post('/:id/complete', handleCompleteChore);

export default router;
