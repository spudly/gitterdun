import {z} from 'zod';
import {MAX_NAME_LENGTH} from '../constants.js';

export const ChoreSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  point_reward: z.number().int().min(0),
  bonus_points: z.number().int().min(0).default(0),
  penalty_points: z.number().int().min(0).default(0),
  // Timestamps in ms since epoch
  start_date: z.number().int().optional(),
  due_date: z.number().int().optional(),
  recurrence_rule: z.string().optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    }),
  status: z
    .string()
    .refine(val => ['pending', 'completed', 'approved'].includes(val), {
      message: 'status must be either "pending", "completed", or "approved"',
    }),
  created_by: z.number(),
  created_at: z.number().int(),
  updated_at: z.number().int(),
});

export const ChoreWithUsernameSchema = ChoreSchema.extend({
  created_by_username: z.string().optional(),
});

export const CreateChoreSchema = z.object({
  title: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  point_reward: z.number().int().min(0),
  bonus_points: z.number().int().min(0).optional().default(0),
  penalty_points: z.number().int().min(0).optional().default(0),
  start_date: z.number().int().optional(),
  due_date: z.number().int().optional(),
  recurrence_rule: z.string().optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    })
    .default('required'),
  assigned_users: z.array(z.number()).optional(),
});

export const UpdateChoreSchema = z.object({
  title: z.string().min(1).max(MAX_NAME_LENGTH).optional(),
  description: z.string().optional(),
  point_reward: z.number().int().min(0).optional(),
  bonus_points: z.number().int().min(0).optional(),
  penalty_points: z.number().int().min(0).optional(),
  start_date: z.iso.datetime().optional(),
  due_date: z.iso.datetime().optional(),
  recurrence_rule: z.string().optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    })
    .optional(),
  status: z
    .string()
    .refine(val => ['pending', 'completed', 'approved'].includes(val), {
      message: 'status must be either "pending", "completed", or "approved"',
    })
    .optional(),
});

export type Chore = z.infer<typeof ChoreSchema>;
export type ChoreWithUsername = z.infer<typeof ChoreWithUsernameSchema>;
export type CreateChore = z.infer<typeof CreateChoreSchema>;
export type UpdateChore = z.infer<typeof UpdateChoreSchema>;
