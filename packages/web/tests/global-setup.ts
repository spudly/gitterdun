import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FullConfig } from '@playwright/test';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

async function globalSetup(_config: FullConfig) {
  // Prepare a clean SQLite DB for E2E
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dbPath = path.resolve(__dirname, '../../../data/e2e.db');
  const dbDir = path.dirname(dbPath);
  await fs.promises.mkdir(dbDir, { recursive: true });
  if (fs.existsSync(dbPath)) {
    await fs.promises.rm(dbPath, { force: true });
  }
  // Load schema from API package and execute
  const schemaPath = path.resolve(__dirname, '../../../packages/api/src/lib/schema.sqlite.sql');
  const schema = await fs.promises.readFile(schemaPath, 'utf8');
  const db = new Database(dbPath);
  db.exec(schema);

  // Seed default admin and a family so admin UI has data
  const hashed = bcrypt.hashSync('admin123', 10);
  const insertAdmin = db.prepare(
    `INSERT OR IGNORE INTO users (username, email, password_hash, role, points, streak_count)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  insertAdmin.run('admin', 'admin@gitterdun.com', hashed, 'admin', 42, 3);
  const admin = db.prepare(`SELECT id FROM users WHERE email = ?`).get('admin@gitterdun.com') as { id: number };
  if (admin?.id) {
    const insertFamily = db.prepare(`INSERT INTO families (name, owner_id) VALUES (?, ?)`);
    const familyResult = insertFamily.run('Test Family', admin.id);
    const familyId = (familyResult as any).lastInsertRowid as number;
    const insertMember = db.prepare(
      `INSERT OR IGNORE INTO family_members (family_id, user_id, role) VALUES (?, ?, ?)`
    );
    insertMember.run(familyId, admin.id, 'parent');

    // Seed chores with diverse statuses and attributes
    const insertChore = db.prepare(
      `INSERT INTO chores (title, description, point_reward, bonus_points, penalty_points, due_date, chore_type, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const now = new Date();
    const dueSoon = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    insertChore.run('Pending Chore', 'to do', 5, 0, 0, dueSoon, 'required', 'pending', admin.id);
    insertChore.run('Completed Chore', 'done', 10, 0, 0, null, 'required', 'completed', admin.id);
    insertChore.run('Approved Bonus', 'bonus', 7, 2, 0, null, 'bonus', 'approved', admin.id);
    insertChore.run('Penalty Chore', 'has penalty', 3, 0, 1, null, 'required', 'pending', admin.id);

    // Seed goals for various statuses
    const insertGoal = db.prepare(
      `INSERT INTO goals (user_id, title, description, target_points, current_points, status)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    insertGoal.run(admin.id, 'Active Goal', 'progressing', 10, 2, 'active');
    insertGoal.run(admin.id, 'Completed Goal', 'done', 5, 5, 'completed');
    insertGoal.run(admin.id, 'Abandoned Goal', 'stopped', 8, 1, 'abandoned');
  }
}

export default globalSetup;

