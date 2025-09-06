import {z} from 'zod';

// Base schema - uses Date objects for internal processing
export const ChoreAssignmentSchema = z.object({
  id: z.number(),
  chore_id: z.number(),
  user_id: z.number(),
  assigned_at: z.date(),
  completed_at: z.date().optional(),
  approved_at: z.date().optional(),
  approved_by: z.number().optional(),
  points_earned: z.number().int().min(0).default(0),
  bonus_points_earned: z.number().int().min(0).default(0),
  penalty_points_earned: z.number().int().min(0).default(0),
  notes: z.string().optional(),
});

// Outgoing schema - transforms dates to timestamps for API requests
export const OutgoingChoreAssignmentSchema = z.object({
  ...ChoreAssignmentSchema.shape,
  assigned_at: z.date().transform(date => date.getTime()),
  completed_at: z
    .date()
    .optional()
    .transform(date => (date !== undefined ? date.getTime() : undefined)),
  approved_at: z
    .date()
    .optional()
    .transform(date => (date !== undefined ? date.getTime() : undefined)),
});

// Incoming schema - transforms timestamps to dates from API responses
export const IncomingChoreAssignmentSchema = z.object({
  id: z.number(),
  chore_id: z.number(),
  user_id: z.number(),
  assigned_at: z
    .number()
    .int()
    .transform(timestamp => new Date(timestamp)),
  completed_at: z
    .number()
    .int()
    .optional()
    .transform(timestamp =>
      timestamp !== undefined ? new Date(timestamp) : undefined,
    ),
  approved_at: z
    .number()
    .int()
    .optional()
    .transform(timestamp =>
      timestamp !== undefined ? new Date(timestamp) : undefined,
    ),
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
export type OutgoingChoreAssignment = z.infer<
  typeof OutgoingChoreAssignmentSchema
>;
export type IncomingChoreAssignment = z.infer<
  typeof IncomingChoreAssignmentSchema
>;
export type UpdateChoreAssignment = z.infer<typeof UpdateChoreAssignmentSchema>;
