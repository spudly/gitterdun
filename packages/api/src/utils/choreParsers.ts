import express from 'express';
import {
  ChoreQuerySchema,
  IdParamSchema,
  CompleteChoreBodySchema,
  UpdateChoreSchema,
} from '@gitterdun/shared';

export const parseChoresQueryRequest = (req: express.Request) => {
  const validatedQuery = ChoreQuerySchema.parse(req.query);
  const {
    status,
    chore_type: choreType,
    user_id: userId,
    page,
    limit,
  } = validatedQuery;
  return {status, choreType, userId, page, limit};
};

export const parseGetChoreRequest = (req: express.Request) => {
  const {id: choreId} = IdParamSchema.parse(req.params);
  return {choreId};
};

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

export const validateGetChoreInput = (choreId: number) => {
  if (Number.isNaN(choreId)) {
    throw new Error('Invalid chore ID');
  }
};

export const validateUpdateChoreInput = (choreId: number) => {
  if (Number.isNaN(choreId)) {
    throw new Error('Invalid chore ID');
  }
};

export const validateDeleteChoreInput = (choreId: number) => {
  if (Number.isNaN(choreId)) {
    throw new Error('Invalid chore ID');
  }
};

export const validateChoreCompletionInput = (choreId: number) => {
  if (Number.isNaN(choreId)) {
    throw new Error('Invalid chore ID');
  }
};
