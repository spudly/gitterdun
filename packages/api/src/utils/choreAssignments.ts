import {ChoreAssignmentSchema} from '@gitterdun/shared';
import db from '../lib/db';
import {sql} from './sql';

export const findChoreAssignment = (choreId: number, userId: number) => {
  const assignmentRow = db
    .prepare(sql`
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
    `)
    .get(choreId, userId);

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

export const updateChoreAssignmentCompletion = (
  params: ChoreCompletionParams,
) => {
  const {choreId, userId, points, notes} = params;
  db.prepare(sql`
    UPDATE chore_assignments
    SET
      completed_at = CURRENT_TIMESTAMP,
      points_earned = ?,
      bonus_points_earned = ?,
      penalty_points_earned = ?,
      notes = ?
    WHERE
      chore_id = ?
      AND user_id = ?
  `).run(
    points.pointsEarned,
    points.bonusPointsEarned,
    points.penaltyPointsEarned,
    notes,
    choreId,
    userId,
  );
};
