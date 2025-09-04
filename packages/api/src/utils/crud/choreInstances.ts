import {isPostgresEnabled} from '../env';
import {run} from './db';
import {sql} from '../sql';

export const upsertChoreInstance = async (
  choreId: number,
  instanceDate: string,
  status: 'complete' | 'incomplete',
  approvalStatus: 'approved' | 'unapproved' | 'rejected',
  notes: string | null,
): Promise<void> => {
  if (isPostgresEnabled()) {
    await run(
      sql`
        INSERT INTO
          chore_instances (
            chore_id,
            instance_date,
            status,
            approval_status,
            notes
          )
        VALUES
          (?, ?, ?, ?, ?)
        ON CONFLICT (chore_id, instance_date) DO UPDATE
        SET
          status = excluded.status,
          approval_status = excluded.approval_status,
          notes = excluded.notes
      `,
      choreId,
      instanceDate,
      status,
      approvalStatus,
      notes,
    );
    return;
  }

  // SQLite supports ON CONFLICT .. DO UPDATE on unique constraints when using
  // the full syntax with conflict target as well. Use the same shape for parity.
  await run(
    sql`
      INSERT INTO
        chore_instances (
          chore_id,
          instance_date,
          status,
          approval_status,
          notes
        )
      VALUES
        (?, ?, ?, ?, ?)
      ON CONFLICT (chore_id, instance_date) DO UPDATE
      SET
        status = excluded.status,
        approval_status = excluded.approval_status,
        notes = excluded.notes
    `,
    choreId,
    instanceDate,
    status,
    approvalStatus,
    notes,
  );
};
