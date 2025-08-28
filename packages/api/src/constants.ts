/**
 * Application constants for the API package
 */

import {ONE_MINUTE_MS, ONE_DAY_MS} from '@gitterdun/shared';

/**
 * Number of salt rounds for bcrypt password hashing.
 * Higher values are more secure but slower.
 * 12 rounds is a good balance for 2024.
 */
export const BCRYPT_SALT_ROUNDS = 12;

/**
 * Default port for the API server when PORT environment variable is not set
 */
export const DEFAULT_PORT = 8000;

/**
 * Default limit for chore pagination responses when no limit is specified.
 * Should align with ChoreQuerySchema default in shared package.
 */
export const DEFAULT_CHORE_PAGINATION_LIMIT = 20;

/**
 * Number of bytes for generating secure invitation tokens.
 * 24 bytes = 48 hex characters, providing sufficient entropy for security.
 */
export const INVITATION_TOKEN_BYTES = 24;

/**
 * Number of bytes for generating secure tokens (password reset, session IDs).
 * 32 bytes = 64 hex characters, providing high entropy for security-critical tokens.
 */
export const SECURE_TOKEN_BYTES = 32;

/** 15 minutes for password reset tokens */
const PASSWORD_RESET_EXPIRATION_MINUTES = 15;
export const PASSWORD_RESET_EXPIRATION_MS =
  PASSWORD_RESET_EXPIRATION_MINUTES * ONE_MINUTE_MS;

/** 24 hours for invitation tokens */
export const INVITATION_EXPIRATION_MS = ONE_DAY_MS;

/** 7 days for session tokens */
const SESSION_EXPIRATION_DAYS = 7;
export const SESSION_EXPIRATION_MS = SESSION_EXPIRATION_DAYS * ONE_DAY_MS;
