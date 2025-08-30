import {defineMessages} from 'react-intl';

export const adminChoresMessages = defineMessages({
  header: {
    defaultMessage: 'Chores Management',
    id: 'pages.admin.AdminChoresManagement.chores-management',
  },
  pointsWithValue: {
    defaultMessage: 'Points: {points}',
    id: 'pages.admin.AdminChoresManagement.points-points',
  },
  bonusWithPoints: {
    defaultMessage: 'Bonus: +{points}',
    id: 'pages.admin.AdminChoresManagement.bonus-points',
  },
  penaltyWithPoints: {
    defaultMessage: 'Penalty: -{points}',
    id: 'pages.admin.AdminChoresManagement.penalty-points',
  },
  dueWithDate: {
    defaultMessage: 'Due: {date}',
    id: 'pages.admin.AdminChoresManagement.due-date',
  },
  approve: {
    defaultMessage: 'Approve',
    id: 'pages.admin.AdminChoresManagement.approve',
  },
  reject: {
    defaultMessage: 'Reject',
    id: 'pages.admin.AdminChoresManagement.reject',
  },
  edit: {defaultMessage: 'Edit', id: 'pages.admin.AdminChoresManagement.edit'},
  statusCompleted: {
    defaultMessage: 'Completed',
    id: 'pages.admin.AdminChoresManagement.completed',
  },
  statusApproved: {
    defaultMessage: 'Approved',
    id: 'pages.admin.AdminChoresManagement.approved',
  },
  statusPending: {
    defaultMessage: 'Pending',
    id: 'pages.admin.AdminChoresManagement.pending',
  },
  typeBonus: {
    defaultMessage: 'Bonus',
    id: 'pages.admin.AdminChoresManagement.bonus',
  },
});
