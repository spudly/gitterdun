import {z} from 'zod';

export const GoalSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  target_points: z.number().int().min(0),
  current_points: z.number().int().min(0).default(0),
  status: z
    .string()
    .refine(val => ['active', 'completed', 'abandoned'].includes(val), {
      message: 'status must be either "active", "completed", or "abandoned"',
    }),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const CreateGoalSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  target_points: z.number().int().min(0),
});

export const UpdateGoalSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  target_points: z.number().int().min(0).optional(),
  current_points: z.number().int().min(0).optional(),
  status: z.enum(['active', 'completed', 'abandoned']).optional(),
});

export type Goal = z.infer<typeof GoalSchema>;
export type CreateGoal = z.infer<typeof CreateGoalSchema>;
export type UpdateGoal = z.infer<typeof UpdateGoalSchema>;
