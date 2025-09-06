import {z} from 'zod';
import {MAX_NAME_LENGTH} from '../constants.js';
import {RecurrenceSchema} from './recurrence.js';

// Base schema - uses Date objects for internal processing
export const ChoreSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  reward_points: z.number().int().min(0).optional(),
  penalty_points: z.number().int().min(0).default(0),
  start_date: z.date().optional(),
  due_date: z.date().optional(),
  recurrence_rule: z.string().optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    }),
  // status is derived from chore instances; not part of chore definition
  status: z
    .string()
    .refine(val => ['pending', 'completed', 'approved'].includes(val), {
      message: 'status must be either "pending", "completed", or "approved"',
    })
    .optional(),
  created_by: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Outgoing schema - transforms dates to timestamps for API requests
export const OutgoingChoreSchema = z.object({
  ...ChoreSchema.shape,
  start_date: z
    .date()
    .optional()
    .transform(date => (date !== undefined ? date.getTime() : undefined)),
  due_date: z
    .date()
    .optional()
    .transform(date => (date !== undefined ? date.getTime() : undefined)),
  created_at: z.date().transform(date => date.getTime()),
  updated_at: z.date().transform(date => date.getTime()),
});

// Incoming schema - transforms timestamps to dates from API responses
export const IncomingChoreSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  reward_points: z.number().int().min(0).optional(),
  penalty_points: z.number().int().min(0).default(0),
  start_date: z
    .number()
    .int()
    .optional()
    .transform(timestamp =>
      timestamp !== undefined ? new Date(timestamp) : undefined,
    ),
  due_date: z
    .number()
    .int()
    .optional()
    .transform(timestamp =>
      timestamp !== undefined ? new Date(timestamp) : undefined,
    ),
  recurrence_rule: z.string().optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    }),
  // status is derived from chore instances; not part of chore definition
  status: z
    .string()
    .refine(val => ['pending', 'completed', 'approved'].includes(val), {
      message: 'status must be either "pending", "completed", or "approved"',
    })
    .optional(),
  created_by: z.number(),
  created_at: z
    .number()
    .int()
    .transform(timestamp => new Date(timestamp)),
  updated_at: z
    .number()
    .int()
    .transform(timestamp => new Date(timestamp)),
});

export const ChoreWithUsernameSchema = ChoreSchema.extend({
  created_by_username: z.string().optional(),
});

export const OutgoingChoreWithUsernameSchema = OutgoingChoreSchema.extend({
  created_by_username: z.string().optional(),
});

export const IncomingChoreWithUsernameSchema = IncomingChoreSchema.extend({
  created_by_username: z.string().optional(),
});

// API schema for creating chores - uses number timestamps
export const CreateChoreSchema = z.object({
  title: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  reward_points: z.number().int().min(0).optional(),
  penalty_points: z.number().int().min(0).optional().default(0),
  start_date: z.number().int().optional(),
  due_date: z.number().int().optional(),
  recurrence: RecurrenceSchema.optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    })
    .default('required'),
  assigned_users: z.array(z.number()).optional(),
});

// API schema for updating chores - uses number timestamps
export const UpdateChoreSchema = z.object({
  title: z.string().min(1).max(MAX_NAME_LENGTH).optional(),
  description: z.string().optional(),
  reward_points: z.number().int().min(0).optional(),
  penalty_points: z.number().int().min(0).optional(),
  start_date: z.number().int().optional(),
  due_date: z.number().int().optional(),
  recurrence_rule: z.string().optional(),
  chore_type: z
    .string()
    .refine(val => ['required', 'bonus'].includes(val), {
      message: 'chore_type must be either "required" or "bonus"',
    })
    .optional(),
  // status cannot be updated at chore definition level
});

export type Chore = z.infer<typeof ChoreSchema>;
export type OutgoingChore = z.infer<typeof OutgoingChoreSchema>;
export type IncomingChore = z.infer<typeof IncomingChoreSchema>;
export type ChoreWithUsername = z.infer<typeof ChoreWithUsernameSchema>;
export type OutgoingChoreWithUsername = z.infer<
  typeof OutgoingChoreWithUsernameSchema
>;
export type IncomingChoreWithUsername = z.infer<
  typeof IncomingChoreWithUsernameSchema
>;
export type CreateChore = z.infer<typeof CreateChoreSchema>;
export type UpdateChore = z.infer<typeof UpdateChoreSchema>;
