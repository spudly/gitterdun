import express from 'express';
import {
  IdParamSchema,
  CompleteChoreBodySchema,
  UpdateChoreSchema,
} from '@gitterdun/shared';

export const parseUpdateChoreRequest = (req: express.Request) => {
  const {id} = IdParamSchema.parse(req.params);
  const validatedBody = UpdateChoreSchema.parse(req.body);
  return {choreId: id, validatedBody};
};

export const parseDeleteChoreRequest = (req: express.Request) => {
  const {id} = IdParamSchema.parse(req.params);
  return {choreId: id};
};

export const parseChoreCompletionRequest = (req: express.Request) => {
  const {id} = IdParamSchema.parse(req.params);
  const {userId, notes} = CompleteChoreBodySchema.parse(req.body);
  return {choreId: id, userId, notes};
};

export const validateChoreCompletionInput = (choreId: number) => {
  if (Number.isNaN(choreId)) {
    throw new Error('Invalid chore ID');
  }
};
