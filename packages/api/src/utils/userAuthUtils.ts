import type {Response} from 'express';
import bcrypt from 'bcryptjs';
import {
  UserWithPasswordRowSchema,
  UserSchema,
  CreateUserSchema,
} from '@gitterdun/shared';
import {z} from 'zod';
import db from '../lib/db';
import {logger} from './logger';
import {sql} from './sql';
import {createSession} from './sessionUtils';
import {setSessionCookie} from './cookieUtils';

type UserWithPasswordRow = z.infer<typeof UserWithPasswordRowSchema>;

type CreateUserParams = {
  username: string;
  email: string;
  password: string;
  role: string;
};

const findUserByEmail = (email: string) => {
  const userRow = db
    .prepare(sql`
      SELECT
        id,
        username,
        email,
        password_hash,
        role,
        points,
        streak_count,
        created_at,
        updated_at
      FROM
        users
      WHERE
        email = ?
    `)
    .get(email);
  return userRow === null
    ? undefined
    : UserWithPasswordRowSchema.parse(userRow);
};

const verifyUserPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

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

export const createLoginSession = (res: Response, userId: number) => {
  const {sessionId, expiresAt} = createSession(userId);
  setSessionCookie(res, sessionId, expiresAt);
  return {sessionId, expiresAt};
};
export const prepareLoginResponse = (
  user: UserWithPasswordRow,
  email: string,
) => {
  const validatedUser = prepareUserResponse(user);
  logger.info(`User logged in: ${email}`);
  return {success: true, data: validatedUser, message: 'Login successful'};
};

export const authenticateUser = async (email: string, password: string) => {
  const user = findUserByEmail(email);
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

const checkUserExists = (email: string, username: string) => {
  const existingUser = db
    .prepare(sql`
      SELECT
        id
      FROM
        users
      WHERE
        email = ?
        OR username = ?
    `)
    .get(email, username);
  return existingUser !== null;
};

export const createNewUser = async (params: CreateUserParams) => {
  const {username, email, password, role} = params;
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
    .get(username, email, passwordHash, role);

  return UserSchema.parse(result);
};

export const validateRegistrationData = (body: unknown) => {
  const validatedBody = CreateUserSchema.parse(body);
  const {username, email, password, role = 'user'} = validatedBody;

  if (checkUserExists(email, username)) {
    throw Object.assign(
      new Error('User with this email or username already exists'),
      {status: 409},
    );
  }

  return {username, email, password, role};
};
