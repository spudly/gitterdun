import {defineMessages} from 'react-intl';

export const choresMessages = defineMessages({
  loading: {defaultMessage: 'Loading chores...', id: 'pages.Chores.loading-chores'},
  header: {defaultMessage: 'Chores', id: 'pages.Chores.chores'},
  statusCompleted: {defaultMessage: 'Completed', id: 'pages.admin.AdminChoresManagement.completed'},
  statusApproved: {defaultMessage: 'Approved', id: 'pages.admin.AdminChoresManagement.approved'},
  statusPending: {defaultMessage: 'Pending', id: 'pages.admin.AdminChoresManagement.pending'},
  pointsWithValue: {defaultMessage: 'Points: {points}', id: 'pages.admin.AdminChoresManagement.points-points'},
  bonusWithPoints: {defaultMessage: 'Bonus: +{points}', id: 'pages.admin.AdminChoresManagement.bonus-points'},
  penaltyWithPoints: {defaultMessage: 'Penalty: -{points}', id: 'pages.admin.AdminChoresManagement.penalty-points'},
  dueWithDate: {defaultMessage: 'Due: {date}', id: 'pages.admin.AdminChoresManagement.due-date'},
  complete: {defaultMessage: 'Complete', id: 'pages.Chores.complete'},
  typeBonus: {defaultMessage: 'Bonus', id: 'pages.admin.AdminChoresManagement.bonus'},
});

