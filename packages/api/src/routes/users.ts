import express from 'express';
import {z} from 'zod';
import db from '../lib/db';
import {sql} from '../utils/sql';
import {logger} from '../utils/logger';
import {UserSchema, asError} from '@gitterdun/shared';
import {getUserFromSession} from '../utils/sessionUtils';

// eslint-disable-next-line new-cap -- express.Router() is a factory function
const router = express.Router();

const requireAdmin = (req: express.Request, res: express.Response): boolean => {
  const user = getUserFromSession(req);
  if (!user || user.role !== 'admin') {
    res.status(403).json({success: false, error: 'Forbidden'});
    return false;
  }
  return true;
};

router.get('/', (req, res) => {
  try {
    if (!requireAdmin(req, res)) {
      return;
    }
    const rows = db
      .prepare(sql`
        SELECT
          id,
          username,
          email,
          role,
          points,
          streak_count,
          created_at,
          updated_at
        FROM
          users
        ORDER BY
          id ASC
      `)
      .all();
    const users = rows.map(row => UserSchema.parse(row));
    res.json({success: true, data: users});
  } catch (error) {
    logger.error({error: asError(error)}, 'List users error');
    res.status(500).json({success: false, error: 'Internal server error'});
  }
});

router.delete('/:id', (req, res) => {
  try {
    if (!requireAdmin(req, res)) {
      return;
    }
    const id = z.coerce.number().int().parse(req.params.id);

    // Cleanup references that don't cascade
    db.prepare(sql`
      UPDATE chores
      SET
        created_by = NULL
      WHERE
        created_by = ?
    `).run(id);
    db.prepare(sql`
      DELETE FROM family_invitations
      WHERE
        invited_by = ?
    `).run(id);

    const info = db
      .prepare(sql`
        DELETE FROM users
        WHERE
          id = ?
      `)
      .run(id);
    if (info.changes === 0) {
      res.status(404).json({success: false, error: 'User not found'});
      return;
    }
    res.json({success: true});
  } catch (error) {
    logger.error({error: asError(error)}, 'Delete user error');
    res.status(500).json({success: false, error: 'Internal server error'});
  }
});

export default router;
