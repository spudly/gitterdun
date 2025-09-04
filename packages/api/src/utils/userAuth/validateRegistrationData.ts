import {CreateUserSchema} from '@gitterdun/shared';
import {checkUserExists} from './checkUserExists';

export const validateRegistrationData = async (body: unknown) => {
  const validatedBody = CreateUserSchema.parse(body);
  const {username, email, password, role = 'user'} = validatedBody;

  if (await checkUserExists(email, username)) {
    throw Object.assign(
      new Error('User with this email or username already exists'),
      {status: 409},
    );
  }

  return {username, email, password, role} as const;
};
