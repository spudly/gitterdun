import db from '../lib/db';
import {sql} from './sql';

export const assignChoreToSingleUser = (choreId: number, userId: number) => {
  db.prepare(sql`
    INSERT OR IGNORE INTO
      chore_assignments (chore_id, user_id)
    VALUES
      (?, ?)
  `).run(choreId, userId);
};

export const approveChoreAssignment = (choreId: number, approvedBy: number) => {
  db.prepare(sql`
    UPDATE chore_assignments
    SET
      approved_at = CURRENT_TIMESTAMP,
      approved_by = ?
    WHERE
      chore_id = ?
      AND completed_at IS NOT NULL
  `).run(approvedBy, choreId);

  // Also set chore status to approved
  db.prepare(sql`
    UPDATE chores
    SET
      status = 'approved',
      updated_at = CURRENT_TIMESTAMP
    WHERE
      id = ?
  `).run(choreId);
};

export const rejectChoreAssignment = (choreId: number) => {
  // Reset completion fields and set chore back to pending
  db.prepare(sql`
    UPDATE chore_assignments
    SET
      completed_at = NULL,
      points_earned = 0,
      bonus_points_earned = 0,
      penalty_points_earned = 0,
      approved_at = NULL,
      approved_by = NULL
    WHERE
      chore_id = ?
  `).run(choreId);

  db.prepare(sql`
    UPDATE chores
    SET
      status = 'pending',
      updated_at = CURRENT_TIMESTAMP
    WHERE
      id = ?
  `).run(choreId);
};
