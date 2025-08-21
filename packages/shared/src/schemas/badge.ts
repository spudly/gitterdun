import {z} from 'zod';

export const BadgeSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  icon: z.string().optional(),
  points_required: z.number().int().min(0).default(0),
  streak_required: z.number().int().min(0).default(0),
  created_at: z.iso.datetime(),
});

export type Badge = z.infer<typeof BadgeSchema>;
