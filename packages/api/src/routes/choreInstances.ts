import express from 'express';
import {StatusCodes} from 'http-status-codes';
import {z} from 'zod';
import type {Family} from '@gitterdun/shared';
import {requireUserId} from '../utils/auth';
import {getUserFamily} from '../utils/familyOperations';
import {upsertChoreInstance} from '../utils/crud/choreInstances';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

router.get('/', async (req, res) => {
  const userId = await requireUserId(req);
  const family: Family | null = await getUserFamily(userId);
  if (family === null) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({success: false, error: 'Forbidden'});
  }

  // No chore instance listing yet in API; return empty list
  return res.json({success: true, data: []});
});

router.get('/:id', async (req, res) => {
  const userId = await requireUserId(req);
  const family = await getUserFamily(userId);
  if (family === null) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({success: false, error: 'Forbidden'});
  }

  // Not implemented: return 404 for now
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({success: false, error: 'Chore instance not found'});
});

router.post('/', async (req, res) => {
  const userId = await requireUserId(req);
  const family = await getUserFamily(userId);
  if (family === null) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({success: false, error: 'Forbidden'});
  }

  const body = z
    .object({
      chore_id: z.number(),
      date: z.string(),
      status: z.enum(['complete', 'incomplete']).optional(),
      approval_status: z
        .enum(['approved', 'unapproved', 'rejected'])
        .optional(),
      notes: z.string().optional(),
    })
    .parse(req.body);

  const nextStatus =
    body.status
    ?? (body.approval_status === 'rejected' ? 'incomplete' : 'incomplete');
  const nextApproval =
    body.status === 'complete'
      ? 'unapproved'
      : (body.approval_status ?? 'unapproved');

  await upsertChoreInstance(
    body.chore_id,
    body.date,
    nextStatus,
    nextApproval,
    body.notes ?? null,
  );

  return res.json({success: true});
});

export default router;
