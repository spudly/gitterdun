import express from 'express';
import {
  handleGetChores,
  handleCreateChore,
  handleGetChoreById,
  handleUpdateChore,
  handleDeleteChore,
  handleCompleteChore,
  handleAssignChore,
  handleApproveChore,
  handleRejectChore,
} from './choreHandlers';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

// GET /api/chores - Get all chores
router.get('/', handleGetChores);

// POST /api/chores - Create a new chore
router.post('/', handleCreateChore);

// GET /api/chores/:id - Get a specific chore
router.get('/:id', handleGetChoreById);

// PUT /api/chores/:id - Update a chore
router.put('/:id', handleUpdateChore);

// DELETE /api/chores/:id - Delete a chore
router.delete('/:id', handleDeleteChore);

// POST /api/chores/:id/complete - Mark a chore as completed
router.post('/:id/complete', handleCompleteChore);

// POST /api/chores/:id/assign - Assign a chore to a user
router.post('/:id/assign', handleAssignChore);

// POST /api/chores/:id/approve - Approve a completed chore
router.post('/:id/approve', handleApproveChore);

// POST /api/chores/:id/reject - Reject a completed chore (reset to pending)
router.post('/:id/reject', handleRejectChore);

export default router;
