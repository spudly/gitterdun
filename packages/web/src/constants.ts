import type {NavigationItem} from './widgets/Layout.js';
import {defineMessages} from 'react-intl';
import type {MessageDescriptor} from 'react-intl';
import {ONE_MINUTE_MS, ONE_HOUR_MS} from '@gitterdun/shared';

const navMessages = defineMessages({
  dashboard: {defaultMessage: 'Dashboard', id: 'pages.Dashboard.dashboard'},
  chores: {defaultMessage: 'Chores', id: 'pages.Chores.chores'},
  settings: {defaultMessage: 'Settings', id: 'pages.Settings.settings'},
  leaderboard: {
    defaultMessage: 'Leaderboard',
    id: 'pages.Leaderboard.leaderboard',
  },
  family: {defaultMessage: 'Family', id: 'pages.Family.family'},
});

export const NAVIGATION_ITEMS: Array<NavigationItem> = [
  {message: navMessages.dashboard, path: '/', icon: '🏠'},
  {message: navMessages.chores, path: '/chores', icon: '📋'},
  {message: navMessages.leaderboard, path: '/leaderboard', icon: '🏆'},
  {message: navMessages.family, path: '/family', icon: '👪'},
];

/**
 * Time constants - using shared constants for consistency
 */

/** Cache stale time for user data - 1 hour */
export const USER_STALE_TIME = ONE_HOUR_MS;

/** Default query stale time in minutes */
const DEFAULT_QUERY_STALE_MINUTES = 5;

/** Default query stale time - 5 minutes */
export const DEFAULT_QUERY_STALE_TIME =
  DEFAULT_QUERY_STALE_MINUTES * ONE_MINUTE_MS;

/** Garbage collection time in minutes */
const DEFAULT_GC_MINUTES = 10;

/** Garbage collection time for unused cache entries - 10 minutes */
export const DEFAULT_GC_TIME = DEFAULT_GC_MINUTES * ONE_MINUTE_MS;

/** Timeout delay for navigation after accepting invitation - 1.2 seconds */
export const ACCEPT_INVITATION_REDIRECT_DELAY = 1200;

/**
 * UI and display constants
 */

/** Maximum length for slugified i18n message IDs */
export const MAX_SLUG_LENGTH = 30;

/** Length of 'src/' prefix to remove from file paths */
export const SRC_PREFIX_LENGTH = 4;

/** Number of top performers to show in leaderboard podium */
export const PODIUM_ITEMS_COUNT = 3;

/** Number of days threshold for chores to be considered "due soon" */
export const DUE_SOON_THRESHOLD_DAYS = 3;

/**
 * UI component constants
 */

/** Default toast timeout duration in milliseconds */
export const TOAST_TIMEOUT_DURATION = 4500;

/** Password reset redirect delay in milliseconds */
export const PASSWORD_RESET_REDIRECT_DELAY = 1200;

/**
 * Ranking and position constants
 */

/** First place (gold) rank */
export const GOLD_RANK = 1;

/** Second place (silver) rank */
export const SILVER_RANK = 2;

/** Third place (bronze) rank */
export const BRONZE_RANK = 3;

/** Array of all podium ranks in order */
export const RANKS = [GOLD_RANK, SILVER_RANK, BRONZE_RANK];

export const AVATAR_INITIALS_LENGTH = 2;

const LOCALE_NAME_MESSAGES = defineMessages({
  en: {defaultMessage: 'English', id: 'locale.name.english'},
  pirate: {defaultMessage: 'Pirate', id: 'locale.name.pirate'},
  piglatin: {defaultMessage: 'Pig Latin', id: 'locale.name.piglatin'},
  fr: {defaultMessage: 'French', id: 'locale.name.french'},
  deseret: {defaultMessage: 'Deseret', id: 'locale.name.deseret'},
});

export const SETTINGS_LANGUAGES: ReadonlyArray<{
  readonly id: string;
  readonly nativeName: string;
  readonly i18nMessage: MessageDescriptor;
}> = [
  {id: 'en', nativeName: 'English', i18nMessage: LOCALE_NAME_MESSAGES.en},
  {
    id: 'pirate',
    nativeName: 'Pirate',
    i18nMessage: LOCALE_NAME_MESSAGES.pirate,
  },
  {
    id: 'piglatin',
    nativeName: 'Igpay Atinlay',
    i18nMessage: LOCALE_NAME_MESSAGES.piglatin,
  },
  {id: 'fr', nativeName: 'Français', i18nMessage: LOCALE_NAME_MESSAGES.fr},
  {
    id: 'deseret',
    nativeName: '𐐔𐐯𐑅𐐯𐑉𐐯𐐻',
    i18nMessage: LOCALE_NAME_MESSAGES.deseret,
  },
];

export const EMPTY_ARRAY = [] as const;
