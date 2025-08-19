import express from 'express';

import {
  LeaderboardRowSchema,
  LeaderboardQuerySchema,
  LeaderboardEntrySchema,
} from '@gitterdun/shared';
import db from '../lib/db';
import {logger} from '../utils/logger';
import {sql} from '../utils/sql';

// eslint-disable-next-line new-cap -- not my function
const router = express.Router();

// Schemas moved to shared

const buildLeaderboardQuery = (sortBy: string): string => {
  return sql`
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
};

const processLeaderboardResults = (rows: Array<unknown>) => {
  return rows.map((row: unknown, index: number) => {
    const parsed = LeaderboardRowSchema.parse(row);
    return LeaderboardEntrySchema.parse({rank: index + 1, ...parsed});
  });
};

// GET /api/leaderboard - Get leaderboard rankings
router.get('/', async (req, res) => {
  const {limit, sortBy} = LeaderboardQuerySchema.parse(req.query);
  const query = buildLeaderboardQuery(sortBy);
  const leaderboard = db.prepare(query).all(limit);
  const validatedLeaderboard = processLeaderboardResults(leaderboard);

  logger.info(
    {sortBy, limit, totalUsers: validatedLeaderboard.length},
    'Leaderboard retrieved',
  );

  res.json({
    success: true,
    data: {
      leaderboard: validatedLeaderboard,
      sortBy,
      totalUsers: validatedLeaderboard.length,
    },
  });
});

export default router;
