import {defineMessages} from 'react-intl';

export const choresMessages = defineMessages({
  loading: {
    defaultMessage: 'Loading chores...',
    id: 'pages.Chores.loading-chores',
  },
  header: {defaultMessage: 'Chores', id: 'pages.Chores.chores'},
  statusCompleted: {defaultMessage: 'Completed', id: 'pages.Chores.completed'},
  statusApproved: {defaultMessage: 'Approved', id: 'pages.Chores.approved'},
  statusPending: {defaultMessage: 'Pending', id: 'pages.Chores.pending'},
  pointsWithValue: {
    defaultMessage: 'Points: {points}',
    id: 'pages.Chores.points-points',
  },
  bonusWithPoints: {
    defaultMessage: 'Bonus: +{points}',
    id: 'pages.Chores.bonus-points',
  },
  penaltyWithPoints: {
    defaultMessage: 'Penalty: -{points}',
    id: 'pages.Chores.penalty-points',
  },
  dueWithDate: {defaultMessage: 'Due: {date}', id: 'pages.Chores.due-date'},
  complete: {defaultMessage: 'Complete', id: 'pages.Chores.complete'},
  completeError: {
    defaultMessage: 'Unable to complete chore',
    id: 'pages.Chores.complete-error',
  },
  typeBonus: {defaultMessage: 'Bonus', id: 'pages.Chores.bonus'},
});
