import bcrypt from 'bcryptjs';
import {get} from '../crud/db';
import {sql} from '../sql';
import {UserSchema} from '@gitterdun/shared';
import {BCRYPT_SALT_ROUNDS} from '../../constants';

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
  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const result = get(
    sql`
      INSERT INTO
        users (username, email, password_hash, role)
      VALUES
        (?, ?, ?, ?)
      RETURNING
        id,
        username,
        email,
        role,
        points,
        streak_count,
        created_at,
        updated_at
    `,
    username,
    email ?? null,
    passwordHash,
    role,
  );

  return UserSchema.parse(result);
};
