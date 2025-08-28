import {z} from 'zod';
import {
  MAX_LEADERBOARD_LIMIT,
  DEFAULT_LEADERBOARD_LIMIT,
} from '../constants.js';

export const LeaderboardRowSchema = z.object({
  id: z.number(),
  username: z.string(),
  points: z.number(),
  streak_count: z.number(),
  badges_earned: z.number(),
  chores_completed: z.number(),
});

export const LeaderboardQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_LEADERBOARD_LIMIT)
    .default(DEFAULT_LEADERBOARD_LIMIT),
  sortBy: z.enum(['points', 'streak']).default('points'),
});

export const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  id: z.number(),
  username: z.string(),
  points: z.number(),
  streak_count: z.number(),
  badges_earned: z.number(),
  chores_completed: z.number(),
});

export const LeaderboardResponseSchema = z
  .object({
    leaderboard: z.array(LeaderboardEntrySchema),
    sortBy: z.string(),
    totalUsers: z.number(),
  })
  .loose();

export type LeaderboardResponse = z.infer<typeof LeaderboardResponseSchema>;
