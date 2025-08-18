import {describe, expect, jest, test} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Dashboard from './Dashboard';

jest.mock('../hooks/useUser', () => ({useUser: () => ({user: {id: 1}})}));

jest.mock('../lib/api', () => ({
  choresApi: {
    getAll: jest.fn(async () => ({
      success: true,
      data: [
        {
          id: 1,
          title: 'T1',
          description: '',
          point_reward: 5,
          bonus_points: 0,
          penalty_points: 0,
          chore_type: 'regular',
          status: 'completed',
        },
        {
          id: 2,
          title: 'T2',
          description: '',
          point_reward: 10,
          bonus_points: 0,
          penalty_points: 0,
          chore_type: 'regular',
          status: 'approved',
        },
        {
          id: 3,
          title: 'T3',
          description: '',
          point_reward: 1,
          bonus_points: 0,
          penalty_points: 0,
          chore_type: 'regular',
          status: 'pending',
          due_date: new Date(Date.now() + 86400000).toISOString(),
        },
      ],
    })),
  },
}));

const wrap = (ui: React.ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
);

describe('dashboard page', () => {
  test('renders header', async () => {
    render(wrap(<Dashboard />));
    await expect(screen.findByText('Dashboard')).resolves.toBeInTheDocument();
  });

  test('computes stats and lists recent chores', async () => {
    render(wrap(<Dashboard />));
    await expect(screen.findByText('Dashboard')).resolves.toBeInTheDocument();
    // Completed/Pending counts (multiple '1' exist; assert by nearby labels)
    expect(screen.getByText('Completed Chores').nextSibling).toHaveTextContent(
      '1',
    );
    expect(screen.getByText('Pending Chores').nextSibling).toHaveTextContent(
      '1',
    );
    // Recent chores list titles
    expect(screen.getByText('T1')).toBeInTheDocument();
    expect(screen.getByText('T2')).toBeInTheDocument();
  });
});
