import {ChoreAssignmentSchema} from '@gitterdun/shared';
import {sql} from './sql.js';
import {get, run} from './crud/db.js';

export const findChoreAssignment = async (choreId: number, userId: number) => {
  const assignmentRow = await get(
    sql`
      SELECT
        id,
        chore_id,
        user_id,
        assigned_at,
        completed_at,
        approved_at,
        approved_by,
        points_earned,
        bonus_points_earned,
        penalty_points_earned,
        notes
      FROM
        chore_assignments
      WHERE
        chore_id = ?
        AND user_id = ?
    `,
    choreId,
    userId,
  );

  if (assignmentRow === undefined) {
    throw new Error('Chore assignment not found');
  }

  const assignment = ChoreAssignmentSchema.parse(assignmentRow);
  if (assignment.completed_at !== undefined) {
    throw new Error('Chore is already completed');
  }

  return assignment;
};

export type ChoreCompletionParams = {
  choreId: number;
  userId: number;
  points: {
    pointsEarned: number;
    bonusPointsEarned: number;
    penaltyPointsEarned: number;
  };
  notes?: string | undefined;
};

export const updateChoreAssignmentCompletion = async ({
  choreId,
  userId,
  points,
  notes,
}: ChoreCompletionParams) => {
  await run(
    sql`
      UPDATE chore_assignments
      SET
        completed_at = current_timestamp,
        points_earned = ?,
        bonus_points_earned = ?,
        penalty_points_earned = ?,
        notes = ?
      WHERE
        chore_id = ?
        AND user_id = ?
    `,
    points.pointsEarned,
    points.bonusPointsEarned,
    points.penaltyPointsEarned,
    notes,
    choreId,
    userId,
  );
};
