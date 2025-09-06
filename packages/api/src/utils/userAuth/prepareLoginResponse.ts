import {logger} from '../logger.js';
import {UserWithPasswordRowSchema, UserSchema} from '@gitterdun/shared';
import {z} from 'zod';

type UserWithPasswordRow = z.infer<typeof UserWithPasswordRowSchema>;

const prepareUserResponse = (user: UserWithPasswordRow) => {
  return UserSchema.parse({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    points: user.points,
    streak_count: user.streak_count,
    created_at: user.created_at,
    updated_at: user.updated_at,
  });
};

export const prepareLoginResponse = (
  user: UserWithPasswordRow,
  identifier: string,
) => {
  const validatedUser = prepareUserResponse(user);
  logger.info(`User logged in: ${identifier}`);
  return {
    success: true,
    data: validatedUser,
    message: 'Login successful',
  } as const;
};
