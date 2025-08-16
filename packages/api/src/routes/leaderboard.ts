import express from 'express';
import {z} from 'zod';
import {
  LeaderboardRowSchema,
  LeaderboardQuerySchema,
  LeaderboardEntrySchema,
  asError,
} from '@gitterdun/shared';
import db from '../lib/db';
import {logger} from '../utils/logger';
import {sql} from '../utils/sql';

const router = express.Router();

// Schemas moved to shared

// GET /api/leaderboard - Get leaderboard rankings
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- will upgrade express to v5 to get promise support
router.get('/', async (req, res) => {
  try {
    const {limit, sortBy} = LeaderboardQuerySchema.parse(req.query);

    const query = sql`
      SELECT
        u.id,
        u.username,
        u.points,
        u.streak_count,
        COUNT(ub.badge_id) AS badges_earned,
        COUNT(DISTINCT ca.chore_id) AS chores_completed
      FROM
        users u
        LEFT JOIN user_badges ub ON u.id = ub.user_id
        LEFT JOIN chore_assignments ca ON u.id = ca.user_id
        AND ca.approved_at IS NOT NULL
      WHERE
        u.role = 'user'
      GROUP BY
        u.id,
        u.username,
        u.points,
        u.streak_count
      ORDER BY
        ${sortBy} DESC,
        u.points DESC
      LIMIT
        ?
    `;

    const leaderboard = db.prepare(query).all(limit);
    const validatedLeaderboard = leaderboard.map(
      (row: unknown, index: number) => {
        const parsed = LeaderboardRowSchema.parse(row);
        return LeaderboardEntrySchema.parse({rank: index + 1, ...parsed});
      },
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
      logger.warn({error}, 'Leaderboard query validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid query parameters',
          details: error.stack,
        });
    }

    logger.error({error: asError(error)}, 'Get leaderboard error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

export default router;
