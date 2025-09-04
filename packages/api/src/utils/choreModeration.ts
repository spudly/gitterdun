import {sql} from './sql';
import {run} from './crud/db';
import {isPostgresEnabled} from './env';

export const assignChoreToSingleUser = async (
  choreId: number,
  userId: number,
): Promise<void> => {
  if (isPostgresEnabled()) {
    await run(
      sql`
        INSERT INTO
          chore_assignments (chore_id, user_id)
        VALUES
          (?, ?)
        ON CONFLICT (chore_id, user_id) DO NOTHING
      `,
      choreId,
      userId,
    );
    return;
  }
  await run(
    sql`
      INSERT OR IGNORE INTO
        chore_assignments (chore_id, user_id)
      VALUES
        (?, ?)
    `,
    choreId,
    userId,
  );
};

export const approveChoreAssignment = async (
  choreId: number,
  approvedBy: number,
): Promise<void> => {
  await run(
    sql`
      UPDATE chore_assignments
      SET
        approved_at = CURRENT_TIMESTAMP,
        approved_by = ?
      WHERE
        chore_id = ?
        AND completed_at IS NOT NULL
    `,
    approvedBy,
    choreId,
  );

  // Also set chore status to approved
  // status no longer stored on chores; no direct chore update here
};

export const rejectChoreAssignment = async (choreId: number): Promise<void> => {
  // Reset completion fields and set chore back to pending
  await run(
    sql`
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
    `,
    choreId,
  );

  // status no longer stored on chores; no direct chore update here
};
