import {z} from 'zod';
import {MAX_NAME_LENGTH} from '../constants.js';

export const RewardSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  points_required: z.number().int().min(0),
  is_active: z.boolean().default(true),
  created_by: z.number(),
  created_at: z.iso.datetime(),
});

export const CreateRewardSchema = z.object({
  name: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().optional(),
  points_required: z.number().int().min(0),
});

export type Reward = z.infer<typeof RewardSchema>;
export type CreateReward = z.infer<typeof CreateRewardSchema>;
