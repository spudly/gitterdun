/**
 * Application constants for the shared package
 */

/**
 * Time calculation constants
 */
const ONE_SECOND_MS = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
export const ONE_MINUTE_MS = SECONDS_PER_MINUTE * ONE_SECOND_MS;
export const ONE_HOUR_MS = MINUTES_PER_HOUR * ONE_MINUTE_MS;
export const ONE_DAY_MS = HOURS_PER_DAY * ONE_HOUR_MS;

/**
 * Authentication and security constants
 */

/**
 * Minimum password length for user registration and password reset.
 * Based on security requirements while maintaining usability.
 */
export const MIN_PASSWORD_LENGTH = 4;

/**
 * Text length constraints - standardized to 255 characters for all names and titles
 */

/**
 * Standard maximum length for all names, titles, and text fields.
 * Set to 255 characters to provide ample space while maintaining database efficiency.
 * Applies to: badges, families, chores, goals, notifications, rewards, emails.
 */
export const MAX_NAME_LENGTH = 255;

/**
 * Maximum length for usernames.
 * Kept at 50 characters for readability and UX considerations.
 */
export const MAX_USERNAME_LENGTH = 50;

/**
 * Maximum limit for leaderboard queries.
 * Prevents excessive server load from large leaderboard requests.
 */
export const MAX_LEADERBOARD_LIMIT = 100;

/**
 * Default limit for leaderboard queries when no limit is specified.
 * Balances performance with useful data display.
 */
export const DEFAULT_LEADERBOARD_LIMIT = 10;

/**
 * Maximum limit for pagination queries.
 * Prevents excessive server load from large paginated requests.
 */
export const MAX_PAGINATION_LIMIT = 100;

/**
 * Default limit for pagination when no limit is specified.
 * Provides a reasonable balance between data volume and performance.
 */
export const DEFAULT_PAGINATION_LIMIT = 20;
