import {z} from 'zod';

export const ChoreAssignmentSchema = z.object({
  id: z.number(),
  chore_id: z.number(),
  user_id: z.number(),
  assigned_at: z.number().int(),
  completed_at: z.number().int().optional(),
  approved_at: z.number().int().optional(),
  approved_by: z.number().optional(),
  points_earned: z.number().int().min(0).default(0),
  bonus_points_earned: z.number().int().min(0).default(0),
  penalty_points_earned: z.number().int().min(0).default(0),
  notes: z.string().optional(),
});

export const UpdateChoreAssignmentSchema = z.object({
  completed_at: z.number().int().optional(),
  approved_at: z.number().int().optional(),
  approved_by: z.number().optional(),
  points_earned: z.number().int().min(0).optional(),
  bonus_points_earned: z.number().int().min(0).optional(),
  penalty_points_earned: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

export type ChoreAssignment = z.infer<typeof ChoreAssignmentSchema>;
export type UpdateChoreAssignment = z.infer<typeof UpdateChoreAssignmentSchema>;
