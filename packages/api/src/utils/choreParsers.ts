import express from 'express';
import {z} from 'zod';
import {
  IdParamSchema,
  CompleteChoreBodySchema,
  UpdateChoreSchema,
} from '@gitterdun/shared';

type RequestWithIdParam = express.Request<
  Record<string, string>,
  unknown,
  unknown,
  unknown
>;
type RequestWithBody = express.Request<
  Record<string, string>,
  unknown,
  unknown,
  unknown
>;
type CompleteChoreBody = z.infer<typeof CompleteChoreBodySchema>;

export const parseUpdateChoreRequest = (
  req: RequestWithBody,
): {choreId: number; validatedBody: z.infer<typeof UpdateChoreSchema>} => {
  const {id} = IdParamSchema.parse(req.params);
  const validatedBody = UpdateChoreSchema.parse(req.body);
  return {choreId: id, validatedBody};
};

export const parseDeleteChoreRequest = (
  req: RequestWithIdParam,
): {choreId: number} => {
  const {id} = IdParamSchema.parse(req.params);
  return {choreId: id};
};

export const parseChoreCompletionRequest = (
  req: RequestWithBody,
): {
  choreId: number;
  userId: CompleteChoreBody['userId'];
  notes: CompleteChoreBody['notes'];
} => {
  const {id} = IdParamSchema.parse(req.params);
  const {userId, notes} = CompleteChoreBodySchema.parse(req.body);
  return {choreId: id, userId, notes};
};

export const validateChoreCompletionInput = (choreId: number): void => {
  if (Number.isNaN(choreId)) {
    throw new Error('Invalid chore ID');
  }
};
