import {describe, expect, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import type {ChoreWithUsername} from '@gitterdun/shared';
import {createWrapper} from '../../test/createWrapper';
import {AdminChoresManagement} from './AdminChoresManagement';

const renderWithProviders = (ui: React.ReactElement) =>
  render(ui, {wrapper: createWrapper({i18n: true, queryClient: true})});

describe('<AdminChoresManagement />', () => {
  test('renders header and i18n labels for meta and actions', async () => {
    const chores: Array<ChoreWithUsername> = [
      {
        id: 1,
        title: 'Wash dishes',
        description: 'Kitchen sink',
        point_reward: 5,
        bonus_points: 1,
        penalty_points: 0,
        chore_type: 'bonus',
        status: 'completed',
        due_date: new Date().toISOString(),
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Take out trash',
        description: '',
        point_reward: 3,
        bonus_points: 0,
        penalty_points: 2,
        chore_type: 'regular',
        status: 'approved',
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        title: 'Vacuum',
        description: '',
        point_reward: 2,
        bonus_points: 0,
        penalty_points: 0,
        chore_type: 'regular',
        status: 'pending',
        created_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    renderWithProviders(<AdminChoresManagement chores={chores} />);

    expect(screen.getByText('Chores Management')).toBeInTheDocument();

    // Meta labels
    expect(screen.getByText('Points: 5')).toBeInTheDocument();
    expect(screen.getByText('Bonus: +1')).toBeInTheDocument();
    expect(screen.getByText('Penalty: -2')).toBeInTheDocument();
    expect(screen.getByText(/Due:/u)).toBeInTheDocument();

    // Status labels
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Approved/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();

    // Action buttons
    expect(screen.getByRole('button', {name: 'Approve'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Reject'})).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', {name: 'Edit'}).length,
    ).toBeGreaterThanOrEqual(1);

    // Bonus badge
    expect(screen.getAllByText('Bonus').length).toBeGreaterThanOrEqual(1);
  });
});
