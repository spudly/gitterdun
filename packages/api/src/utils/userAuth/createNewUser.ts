import bcrypt from 'bcryptjs';
import db from '../../lib/db';
import {sql} from '../sql';
import {UserSchema} from '@gitterdun/shared';

type CreateUserParams = {
  username: string;
  email?: string;
  password: string;
  role: string;
};

export const createNewUser = async ({
  username,
  email,
  password,
  role,
}: CreateUserParams) => {
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const result = db
    .prepare(sql`
      INSERT INTO
        users (username, email, password_hash, role)
      VALUES
        (?, ?, ?, ?) RETURNING id,
        username,
        email,
        role,
        points,
        streak_count,
        created_at,
        updated_at
    `)
    .get(username, email ?? null, passwordHash, role);

  return UserSchema.parse(result);
};
