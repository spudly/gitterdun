import {render, screen} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Chores from './Chores';
import * as apiModule from '../lib/api';

jest.mock('../hooks/useUser', () => ({useUser: () => ({user: {id: 1}})}));

jest.mock('../lib/api', () => ({
  choresApi: {
    getAll: jest.fn(async () => ({
      success: true,
      data: [
        {
          id: 1,
          title: 'A',
          description: 'd',
          point_reward: 1,
          bonus_points: 0,
          penalty_points: 0,
          chore_type: 'bonus',
          status: 'completed',
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    })),
  },
}));

const wrap = (ui: React.ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
);

describe('Chores page', () => {
  it('renders header', async () => {
    render(wrap(<Chores />));
    expect(await screen.findByText('Chores')).toBeInTheDocument();
  });

  it('renders status dot/badge branches including pending', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.choresApi.getAll.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 2,
          title: 'B',
          description: '',
          point_reward: 2,
          bonus_points: 1,
          penalty_points: 0,
          chore_type: 'regular',
          status: 'approved',
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 3,
          title: 'C',
          description: '',
          point_reward: 3,
          bonus_points: 0,
          penalty_points: 0,
          chore_type: 'regular',
          status: 'pending',
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });
    render(wrap(<Chores />));
    expect(await screen.findByText('B')).toBeInTheDocument();
    expect(screen.getByText('approved')).toBeInTheDocument();
    expect(await screen.findByText('C')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Complete'})).toBeInTheDocument();
  });

  it('renders penalty and due date meta when present', async () => {
    const mocked = jest.mocked(apiModule);
    mocked.choresApi.getAll.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 4,
          title: 'D',
          description: '',
          point_reward: 4,
          bonus_points: 0,
          penalty_points: 2,
          chore_type: 'regular',
          status: 'approved',
          due_date: new Date().toISOString(),
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });
    render(wrap(<Chores />));
    expect(await screen.findByText('D')).toBeInTheDocument();
    expect(screen.getByText(/Penalty:/)).toBeInTheDocument();
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });
});
