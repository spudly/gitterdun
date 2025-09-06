import type {
  RequestDefault,
  RequestWithQuery,
  TypedResponse,
} from '../types/http.js';
import {asError, ChoreQuerySchema} from '@gitterdun/shared';
import {StatusCodes} from 'http-status-codes';
import {sql} from '../utils/sql.js';
import {all} from '../utils/crud/db.js';
import {
  DEFAULT_LIMIT,
  buildFilters,
  fetchTotalChores,
  mapRowToSchema,
} from './helpers/choreRead.js';
// DbChoreRow no longer used; map rows directly

export const handleGetChores = async (
  req: RequestWithQuery<unknown>,
  res: TypedResponse,
): Promise<void> => {
  try {
    const parsed = ChoreQuerySchema.parse(req.query);
    const {
      status,
      chore_type: choreType,
      user_id: userId,
      page = 1,
      limit = DEFAULT_LIMIT,
    } = parsed;
    const offset = (page - 1) * limit;

    const total = await fetchTotalChores();
    const {where, params} = buildFilters(status, choreType, userId);

    const rows = await all(
      sql`
        SELECT
          c.id,
          c.title,
          c.description,
          c.reward_points AS point_reward,
          0 AS bonus_points,
          c.penalty_points,
          NULL AS due_date,
          NULL AS recurrence_rule,
          c.chore_type,
          'pending' AS status,
          c.created_by,
          current_timestamp AS created_at,
          current_timestamp AS updated_at,
          u.username AS created_by_username
        FROM
          chores c
          JOIN users u ON u.id = c.created_by ${where}
        LIMIT
          ?
        OFFSET
          ?
      `,
      ...params,
      limit,
      offset,
    );

    const data = rows.map(mapRowToSchema);

    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({success: false, error: asError(error).message});
  }
};

export const handleGetChoreById = async (
  _req: RequestDefault,
  res: TypedResponse,
): Promise<void> => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({success: false, error: 'Chore not found'});
};
