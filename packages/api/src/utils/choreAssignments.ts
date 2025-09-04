import {ChoreAssignmentSchema} from '@gitterdun/shared';
import {sql} from './sql';
import {get, run} from './crud/db';

const toTimestamp = (value: unknown): number | undefined => {
  if (typeof value !== 'string' || value.length === 0) {
    return undefined;
  }
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }
  const candidate = `${value.replace(' ', 'T')}Z`;
  const parsedCandidate = Date.parse(candidate);
  if (!Number.isNaN(parsedCandidate)) {
    return parsedCandidate;
  }
  return undefined;
};

const requireTimestamp = (value: unknown, fieldName: string): number => {
  const ts = toTimestamp(value);
  if (ts == null) {
    throw new Error(`Invalid or missing timestamp for ${fieldName}`);
  }
  return ts;
};

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

  const base = assignmentRow;
  const normalized = {
    ...base,
    assigned_at: requireTimestamp(base['assigned_at'], 'assigned_at'),
    completed_at: toTimestamp(base['completed_at']),
    approved_at: toTimestamp(base['approved_at']),
    approved_by: base['approved_by'] ?? undefined,
    notes: (base['notes'] as string | null | undefined) ?? undefined,
  };
  const assignment = ChoreAssignmentSchema.parse(normalized);
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
        completed_at = CURRENT_TIMESTAMP,
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
