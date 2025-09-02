import {Router as createRouter} from 'express';
import {StatusCodes} from 'http-status-codes';
import {z} from 'zod';
import {requireUserId} from '../utils/auth';
import {getUserFamily} from '../utils/familyOperations';
import type {Family} from '@gitterdun/shared';
import {all, get, run} from '../utils/crud/db';
import {sql} from '../utils/sql';
import {occursOnDate} from '../utils/recurrence';

const router = createRouter();

const PAD_TO_TWO = 2;

const ChoreInstanceListItem = z.object({
  chore_id: z.number(),
  title: z.string(),
  status: z.enum(['incomplete', 'complete']),
  approval_status: z.enum(['unapproved', 'approved', 'rejected']),
  notes: z.string().optional(),
});

router.get('/', async (req, res) => {
  const userId = requireUserId(req);
  const family: Family | null = getUserFamily(userId);
  if (family === null) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({success: false, error: 'Forbidden'});
  }
  const dateParam = (req.query['date'] as string | undefined) ?? 'today';
  // const tz = (family as any).timezone ?? 'UTC';
  const now = new Date();
  const requested = dateParam === 'today' ? now : new Date(dateParam);
  // Interpret requested date in the family's timezone
  const year = requested.getUTCFullYear();
  const month = requested.getUTCMonth() + 1;
  const dayOfMonth = requested.getUTCDate();
  const pad2 = (num: number) => String(num).padStart(PAD_TO_TWO, '0');
  const day = `${year}-${pad2(month)}-${pad2(dayOfMonth)}`;

  // Select chores, filter for the day, then join instance if exists
  const chores = all(
    sql`
      SELECT
        id,
        title,
        start_date,
        recurrence_rule
      FROM
        chores
      WHERE
        family_id = ?
      ORDER BY
        start_date ASC NULLS LAST,
        created_at ASC
    `,
    family.id,
  ) as ReadonlyArray<Record<string, unknown>>;

  const choresForDay = chores.filter(chore =>
    occursOnDate(
      (chore['recurrence_rule'] as string | null | undefined) ?? null,
      (chore['start_date'] as string | null | undefined) ?? null,
      new Date(`${day}T00:00:00.000Z`),
    ),
  );

  const instances = all(
    sql`
      SELECT
        chore_id,
        status,
        approval_status,
        notes
      FROM
        chore_instances
      WHERE
        instance_date = ?
    `,
    day,
  ) as ReadonlyArray<Record<string, unknown>>;
  const instanceMap = new Map<number, Record<string, unknown>>(
    instances.map(row => [row['chore_id'] as number, row]),
  );

  const data = choresForDay.map(chore => {
    const id = chore['id'] as number;
    const title = chore['title'] as string;
    const inst = instanceMap.get(id);
    const status = (inst?.['status'] as string | undefined) ?? 'incomplete';
    const approvalStatus =
      (inst?.['approval_status'] as string | undefined) ?? 'unapproved';
    const notes = (inst?.['notes'] as string | null | undefined) ?? undefined;
    return ChoreInstanceListItem.parse({
      chore_id: id,
      title,
      status,
      approval_status: approvalStatus,
      notes: notes ?? undefined,
    });
  });
  return res.json({success: true, data});
});

const UpsertBody = z.object({
  chore_id: z.number(),
  date: z.string(),
  status: z.enum(['incomplete', 'complete']).default('complete'),
  approval_status: z
    .enum(['unapproved', 'approved', 'rejected'])
    .default('unapproved'),
  notes: z.string().optional(),
});

router.post('/', async (req, res) => {
  const userId = requireUserId(req);
  const family = getUserFamily(userId);
  if (family === null) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({success: false, error: 'Forbidden'});
  }
  const body = UpsertBody.parse(req.body);
  const [day] = new Date(body.date).toISOString().split('T');
  // Invariants between status and approval_status
  let nextStatus = body.status;
  let nextApproval = body.approval_status;
  const hasProp = (
    obj: unknown,
    prop: string,
  ): obj is Record<string, unknown> => {
    return typeof obj === 'object' && obj !== null && Object.hasOwn(obj, prop);
  };
  const statusProvided = hasProp(req.body, 'status');
  const approvalProvided = hasProp(req.body, 'approval_status');
  if (statusProvided && body.status === 'complete') {
    nextStatus = 'complete';
    nextApproval = 'unapproved';
  } else if (
    approvalProvided
    && (nextApproval === 'rejected' || nextApproval === 'unapproved')
  ) {
    nextStatus = 'incomplete';
  }
  const existing = get(
    sql`
      SELECT
        id
      FROM
        chore_instances
      WHERE
        chore_id = ?
        AND instance_date = ?
    `,
    body.chore_id,
    day,
  ) as {id?: number} | undefined;
  if (existing && typeof existing.id === 'number') {
    run(
      sql`
        UPDATE chore_instances
        SET
          status = ?,
          approval_status = ?,
          notes = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE
          id = ?
      `,
      nextStatus,
      nextApproval,
      body.notes ?? null,
      existing.id,
    );
  } else {
    run(
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
      `,
      body.chore_id,
      day,
      nextStatus,
      nextApproval,
      body.notes ?? null,
    );
  }
  return res.json({success: true});
});

export default router;
