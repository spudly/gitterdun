import express from 'express';
import bcrypt from 'bcryptjs';
import {LoginSchema, CreateUserSchema, UserSchema} from '@gitterdun/shared';
import {z} from 'zod';
import db from '../lib/db';
import {logger} from '../utils/logger';

const router = express.Router();

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const validatedBody = LoginSchema.parse(req.body);
    const {email, password} = validatedBody;

    // Query user from database
    const user = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as any;

    if (!user) {
      return res
        .status(401)
        .json({success: false, error: 'Invalid credentials'});
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res
        .status(401)
        .json({success: false, error: 'Invalid credentials'});
    }

    // Remove password from response and validate user data
    const userWithoutPassword = {...user};
    delete (userWithoutPassword as any).password_hash;
    const validatedUser = UserSchema.parse(userWithoutPassword);

    logger.info(`User logged in: ${email}`);

    return res.json({
      success: true,
      data: validatedUser,
      message: 'Login successful',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({errors: error.errors}, 'Login validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        });
    }

    logger.error({error: error as Error}, 'Login error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

// POST /api/auth/register - User registration
router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const validatedBody = CreateUserSchema.parse(req.body);
    const {username, email, password, role = 'user'} = validatedBody;

    // Check if user already exists
    const existingUser = db
      .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
      .get(email, username) as any;

    if (existingUser) {
      return res
        .status(409)
        .json({
          success: false,
          error: 'User with this email or username already exists',
        });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = db
      .prepare(
        `
      INSERT INTO users (username, email, password_hash, role) 
      VALUES (?, ?, ?, ?) 
      RETURNING id, username, email, role, points, streak_count, created_at, updated_at
    `,
      )
      .get(username, email, passwordHash, role) as any;

    const validatedUser = UserSchema.parse(result);

    logger.info(`New user registered: ${email}`);

    return res
      .status(201)
      .json({
        success: true,
        data: validatedUser,
        message: 'User registered successfully',
      });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({errors: error.errors}, 'Registration validation error');
      return res
        .status(400)
        .json({
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        });
    }

    logger.error({error: error as Error}, 'Registration error');
    return res
      .status(500)
      .json({success: false, error: 'Internal server error'});
  }
});

export default router;
