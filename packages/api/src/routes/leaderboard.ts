import express from 'express';
import type {RequestWithBody} from '../types/http.js';

import {LeaderboardRowSchema, LeaderboardQuerySchema} from '@gitterdun/shared';
import {sql} from '../utils/sql.js';
import {requireUserId} from '../utils/auth.js';
import {getLeaderboard} from '../utils/crud/leaderboard.js';

// eslint-disable-next-line new-cap -- not my function
const router = express.Router();

// Schemas moved to shared

const buildLeaderboardQuery = (sortBy: string): string => {
  const sortColumn = sortBy === 'streak' ? 'u.streak_count' : 'u.points';
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
      JOIN family_members fm ON fm.user_id = u.id
      LEFT JOIN user_badges ub ON u.id = ub.user_id
      LEFT JOIN chore_assignments ca ON u.id = ca.user_id
      AND ca.approved_at IS NOT NULL
    WHERE
      u.role = 'user'
      AND fm.family_id = (
        SELECT
          fm2.family_id
        FROM
          family_members fm2
        WHERE
          fm2.user_id = ?
      )
    GROUP BY
      u.id,
      u.username,
      u.points,
      u.streak_count
    ORDER BY
      ${sortColumn} DESC,
      u.points DESC
    LIMIT
      ?
  `;
};

const processLeaderboardResults = (rows: Array<unknown>) =>
  rows.map(row => LeaderboardRowSchema.parse(row));

// GET /api/leaderboard - Get leaderboard rankings
router.get('/', async (req: RequestWithBody<unknown>, res) => {
  const userId = await requireUserId(req);
  const {limit, sortBy} = LeaderboardQuerySchema.parse(req.query);
  const query = buildLeaderboardQuery(sortBy);
  const rows = await getLeaderboard(query, userId, limit);
  const parsed = processLeaderboardResults(rows);
  const leaderboard = parsed.map((row, index) => ({rank: index + 1, ...row}));
  res.json({
    success: true,
    data: {leaderboard, sortBy, totalUsers: leaderboard.length},
  });
});

export default router;
