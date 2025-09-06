import {z} from 'zod';
import {MAX_NAME_LENGTH} from '../constants.js';

// Base schema - uses Date objects for internal processing
export const RewardSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  points_required: z.number().int().min(0),
  is_active: z.boolean().default(true),
  created_by: z.number(),
  created_at: z.date(),
});

// Outgoing schema - transforms dates to timestamps for API requests
export const OutgoingRewardSchema = z.object({
  ...RewardSchema.shape,
  created_at: z.date().transform(date => date.getTime()),
});

// Incoming schema - transforms timestamps to dates from API responses
export const IncomingRewardSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  points_required: z.number().int().min(0),
  is_active: z.boolean().default(true),
  created_by: z.number(),
  created_at: z
    .number()
    .int()
    .transform(timestamp => new Date(timestamp)),
});

export const CreateRewardSchema = z.object({
  name: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  points_required: z.number().int().min(0),
});

export type Reward = z.infer<typeof RewardSchema>;
export type OutgoingReward = z.infer<typeof OutgoingRewardSchema>;
export type IncomingReward = z.infer<typeof IncomingRewardSchema>;
export type CreateReward = z.infer<typeof CreateRewardSchema>;
