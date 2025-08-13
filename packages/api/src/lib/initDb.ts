import fs from 'fs';
import path from 'path';
import db from './db';
import {logger} from '../utils/logger';

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src/lib/schema.sqlite.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    db.exec(schema);

    logger.info('Database initialized successfully');

    // Insert a default admin user if none exists
    const adminExists = db
      .prepare('SELECT COUNT(*) as count FROM users WHERE role = ?')
      .get('admin') as {count: number};

    if (adminExists.count === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = bcrypt.default.hashSync('admin123', 10);

      db.prepare(
        `
        INSERT INTO users (username, email, password_hash, role, points, streak_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      ).run('admin', 'admin@gitterdun.com', hashedPassword, 'admin', 0, 0);

      logger.info('Default admin user created: admin@gitterdun.com / admin123');
    }
  } catch (error) {
    logger.error({error: error as Error}, 'Failed to initialize database');
    throw error;
  }
};

export default initializeDatabase;
