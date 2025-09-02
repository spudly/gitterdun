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
  addChore: {defaultMessage: 'Add Chore', id: 'pages.Chores.add-chore'},
  createChore: {defaultMessage: 'Create', id: 'pages.Chores.create'},
  titlePlaceholder: {defaultMessage: 'Title', id: 'pages.Chores.title'},
  pointsPlaceholder: {defaultMessage: 'Points', id: 'pages.Chores.points'},
  descriptionPlaceholder: {
    defaultMessage: 'Description',
    id: 'pages.Chores.description',
  },
  startDateLabel: {defaultMessage: 'Start date', id: 'pages.Chores.start-date'},
  dueDateLabel: {defaultMessage: 'Due date', id: 'pages.Chores.due-date-label'},
  choreTypeLabel: {defaultMessage: 'Chore type', id: 'pages.Chores.type-label'},
  choreTypeRequired: {
    defaultMessage: 'Required',
    id: 'pages.Chores.type-required',
  },
  choreTypeBonus: {defaultMessage: 'Bonus', id: 'pages.Chores.type-bonus'},
  bonusChoreLabel: {
    defaultMessage: 'Bonus Chore',
    id: 'pages.Chores.bonus-chore-label',
  },
  startDateFutureError: {
    defaultMessage: 'Start date must be in the future',
    id: 'pages.Chores.start-date-future-error',
  },
  dueAfterStartError: {
    defaultMessage: 'Due date must be after start date',
    id: 'pages.Chores.due-after-start-error',
  },
  bonusPlaceholder: {
    defaultMessage: 'Bonus',
    id: 'pages.Chores.bonus-placeholder',
  },
  cancel: {defaultMessage: 'Cancel', id: 'pages.Chores.cancel'},
  assigneesLabel: {defaultMessage: 'Assign to', id: 'pages.Chores.assignees'},
  recurrenceLabel: {
    defaultMessage: 'Recurrence',
    id: 'pages.Chores.recurrence',
  },
  recurrenceNone: {defaultMessage: 'None', id: 'pages.Chores.recurrence-none'},
  recurrenceDaily: {
    defaultMessage: 'Daily',
    id: 'pages.Chores.recurrence-daily',
  },
  recurrenceWeekly: {
    defaultMessage: 'Weekly',
    id: 'pages.Chores.recurrence-weekly',
  },
  recurrenceMonthly: {
    defaultMessage: 'Monthly',
    id: 'pages.Chores.recurrence-monthly',
  },
});
