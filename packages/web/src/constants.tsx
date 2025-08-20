import type {NavigationItem} from './widgets/Layout';
import {defineMessages} from 'react-intl';

const navMessages = defineMessages({
  dashboard: {id: 'nav.dashboard', defaultMessage: 'Dashboard'},
  chores: {id: 'nav.chores', defaultMessage: 'Chores'},
  goals: {id: 'nav.goals', defaultMessage: 'Goals'},
  leaderboard: {id: 'nav.leaderboard', defaultMessage: 'Leaderboard'},
});

export const NAVIGATION_ITEMS: Array<NavigationItem> = [
  {name: navMessages.dashboard.id, path: '/', icon: '🏠'},
  {name: navMessages.chores.id, path: '/chores', icon: '📋'},
  {name: navMessages.goals.id, path: '/goals', icon: '🎯'},
  {name: navMessages.leaderboard.id, path: '/leaderboard', icon: '🏆'},
];
