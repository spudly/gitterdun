import express from 'express';
import {z} from 'zod';
import db from '../lib/db';
import {logger} from '../utils/logger';

const router = express.Router();

// Leaderboard query schema
const LeaderboardQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['points', 'streak']).default('points'),
});

// Leaderboard entry schema
const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  id: z.number(),
  username: z.string(),
  points: z.number(),
  streak_count: z.number(),
  badges_earned: z.number(),
  chores_completed: z.number(),
});

// GET /api/leaderboard - Get leaderboard rankings
router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const validatedQuery = LeaderboardQuerySchema.parse(req.query);
    const {limit, sortBy} = validatedQuery;

    const query = `
      SELECT 
        u.id,
        u.username,
        u.points,
        u.streak_count,
        COUNT(ub.badge_id) as badges_earned,
        COUNT(DISTINCT ca.chore_id) as chores_completed
      FROM users u
      LEFT JOIN user_badges ub ON u.id = ub.user_id
      LEFT JOIN chore_assignments ca ON u.id = ca.user_id AND ca.approved_at IS NOT NULL
      WHERE u.role = 'user'
      GROUP BY u.id, u.username, u.points, u.streak_count
      ORDER BY ${sortBy} DESC, u.points DESC
      LIMIT ?
    `;

    const leaderboard = db.prepare(query).all(limit) as any[];
    const validatedLeaderboard = leaderboard.map((row: any, index: number) =>
      LeaderboardEntrySchema.parse({rank: index + 1, ...row}),
    );

    logger.info(
      {sortBy, limit, totalUsers: validatedLeaderboard.length},
      'Leaderboard retrieved',
    );

    return res.json({
      success: true,
      data: {
        leaderboard: validatedLeaderboard,
        sortBy,
        totalUsers: validatedLeaderboard.length,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({errors: error.errors}, 'Leaderboard query validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid query parameters',
          details: error.errors,
        });
    }

    logger.error({error: error as Error}, 'Get leaderboard error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

export default router;
