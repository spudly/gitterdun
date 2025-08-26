import type {NavigationItem} from './widgets/Layout';
import {defineMessages} from 'react-intl';

const navMessages = defineMessages({
  dashboard: {defaultMessage: 'Dashboard', id: 'pages.Dashboard.dashboard'},
  chores: {defaultMessage: 'Chores', id: 'pages.Chores.chores'},
  goals: {defaultMessage: 'Goals', id: 'constants.goals'},
  leaderboard: {
    defaultMessage: 'Leaderboard',
    id: 'pages.Leaderboard.leaderboard',
  },
  family: {defaultMessage: 'Family', id: 'pages.Family.family'},
});

export const NAVIGATION_ITEMS: Array<NavigationItem> = [
  {message: navMessages.dashboard, path: '/', icon: '🏠'},
  {message: navMessages.chores, path: '/chores', icon: '📋'},
  {message: navMessages.goals, path: '/goals', icon: '🎯'},
  {message: navMessages.leaderboard, path: '/leaderboard', icon: '🏆'},
  {message: navMessages.family, path: '/family', icon: '👪'},
];
