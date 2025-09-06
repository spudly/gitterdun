import {z} from 'zod';
import {MAX_NAME_LENGTH} from '../constants.js';

// Base schema - uses Date objects for internal processing
export const GoalSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  target_points: z.number().int().min(0),
  current_points: z.number().int().min(0).default(0),
  status: z
    .string()
    .refine(val => ['active', 'completed', 'abandoned'].includes(val), {
      message: 'status must be either "active", "completed", or "abandoned"',
    }),
  created_at: z.date(),
  updated_at: z.date(),
});

// Outgoing schema - transforms dates to timestamps for API requests
export const OutgoingGoalSchema = z.object({
  ...GoalSchema.shape,
  created_at: z.date().transform(date => date.getTime()),
  updated_at: z.date().transform(date => date.getTime()),
});

// Incoming schema - transforms timestamps to dates from API responses
export const IncomingGoalSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  target_points: z.number().int().min(0),
  current_points: z.number().int().min(0).default(0),
  status: z
    .string()
    .refine(val => ['active', 'completed', 'abandoned'].includes(val), {
      message: 'status must be either "active", "completed", or "abandoned"',
    }),
  created_at: z
    .number()
    .int()
    .transform(timestamp => new Date(timestamp)),
  updated_at: z
    .number()
    .int()
    .transform(timestamp => new Date(timestamp)),
});

export const CreateGoalSchema = z.object({
  title: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  target_points: z.number().int().min(0),
});

export const UpdateGoalSchema = z.object({
  title: z.string().min(1).max(MAX_NAME_LENGTH).optional(),
  description: z.string().optional(),
  target_points: z.number().int().min(0).optional(),
  current_points: z.number().int().min(0).optional(),
  status: z.enum(['active', 'completed', 'abandoned']).optional(),
});

export type Goal = z.infer<typeof GoalSchema>;
export type OutgoingGoal = z.infer<typeof OutgoingGoalSchema>;
export type IncomingGoal = z.infer<typeof IncomingGoalSchema>;
export type CreateGoal = z.infer<typeof CreateGoalSchema>;
export type UpdateGoal = z.infer<typeof UpdateGoalSchema>;
