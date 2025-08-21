import type {NavigationItem} from './widgets/Layout';
import {defineMessages} from 'react-intl';

const navMessages = defineMessages({
  dashboard: {defaultMessage: 'Dashboard'},
  chores: {defaultMessage: 'Chores'},
  goals: {defaultMessage: 'Goals'},
  leaderboard: {defaultMessage: 'Leaderboard'},
});

export const NAVIGATION_ITEMS: Array<NavigationItem> = [
  {message: navMessages.dashboard, path: '/', icon: '🏠'},
  {message: navMessages.chores, path: '/chores', icon: '📋'},
  {message: navMessages.goals, path: '/goals', icon: '🎯'},
  {message: navMessages.leaderboard, path: '/leaderboard', icon: '🏆'},
];
