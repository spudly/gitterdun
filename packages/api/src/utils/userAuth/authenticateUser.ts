import {z} from 'zod';
import {UserWithPasswordRowSchema} from '@gitterdun/shared';
import bcrypt from 'bcryptjs';
import {findUserByEmail, findUserByUsername} from './findUser.js';

type UserWithPasswordRow = z.infer<typeof UserWithPasswordRowSchema>;

const verifyUserPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => bcrypt.compare(password, hashedPassword);

export const authenticateUser = async (
  identifier: {email?: string; username?: string},
  password: string,
): Promise<UserWithPasswordRow> => {
  const email =
    typeof identifier.email === 'string' ? identifier.email.trim() : undefined;
  const username =
    typeof identifier.username === 'string'
      ? identifier.username.trim()
      : undefined;

  let user: UserWithPasswordRow | undefined;
  if (email !== undefined && email !== '') {
    user = await findUserByEmail(email);
  } else if (username !== undefined && username !== '') {
    user = await findUserByUsername(username);
  }

  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), {status: 401});
  }

  const isValidPassword = await verifyUserPassword(
    password,
    user.password_hash,
  );
  if (!isValidPassword) {
    throw Object.assign(new Error('Invalid credentials'), {status: 401});
  }

  return user;
};
