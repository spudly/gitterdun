import {
  CreateGoalSchema,
  UpdateGoalSchema,
  IdParamSchema,
} from '@gitterdun/shared';
import type {RequestWithParamsAndBody} from '../types/http.js';

export const validateCreateGoalData = (body: unknown) => {
  const validatedBody = CreateGoalSchema.parse(body);
  const {title, description, target_points: targetPoints} = validatedBody;

  if (targetPoints <= 0) {
    throw Object.assign(new Error('Target points must be greater than 0'), {
      status: 400,
    });
  }

  return {title, description, targetPoints};
};

export const validateGoalId = (id: number): void => {
  if (Number.isNaN(id)) {
    throw Object.assign(new Error('Invalid goal ID'), {status: 400});
  }
};

export type UpdateGoalRequest = {
  goalId: number;
  updateData: {
    title?: string | undefined;
    description?: string | undefined;
    target_points?: number | undefined;
    current_points?: number | undefined;
    status?: string | undefined;
  };
};

export const validateUpdateGoalRequest = (
  req: RequestWithParamsAndBody<{id: string}, unknown>,
): UpdateGoalRequest => {
  const {id} = IdParamSchema.parse(req.params);
  const updateData = UpdateGoalSchema.parse(req.body);
  validateGoalId(id);
  return {goalId: id, updateData};
};
