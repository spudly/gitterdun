import {render, screen} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Leaderboard from './Leaderboard';
import * as apiModule from '../lib/api';

jest.mock('../lib/api', () => ({
  leaderboardApi: {
    get: jest.fn(async () => ({
      success: true,
      data: {
        leaderboard: [
          {
            rank: 1,
            id: 1,
            username: 'U1',
            points: 10,
            streak_count: 2,
            badges_earned: 1,
            chores_completed: 3,
          },
          {
            rank: 2,
            id: 2,
            username: 'U2',
            points: 5,
            streak_count: 1,
            badges_earned: 0,
            chores_completed: 1,
          },
        ],
        sortBy: 'points',
      },
    })),
  },
}));

const wrap = (ui: React.ReactElement) => (
  <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
);

describe('Leaderboard page', () => {
  it('renders header', async () => {
    render(wrap(<Leaderboard />));
    expect(await screen.findByText('Leaderboard')).toBeInTheDocument();
  });

  it('renders podium and ranking list content', async () => {
    render(wrap(<Leaderboard />));
    const headings = await screen.findAllByText('U1');
    expect(headings.length).toBeGreaterThan(0);
    expect(screen.getAllByText('U2').length).toBeGreaterThan(0);
  });

  it('shows streak-based subtitle when sortBy is streak_count', async () => {
    const {leaderboardApi}: any = apiModule;
    leaderboardApi.get.mockResolvedValueOnce({
      success: true,
      data: {
        leaderboard: [
          {
            rank: 1,
            id: 1,
            username: 'U1',
            points: 10,
            streak_count: 4,
            badges_earned: 1,
            chores_completed: 3,
          },
        ],
        sortBy: 'streak_count',
      },
    });
    render(wrap(<Leaderboard />));
    expect(
      await screen.findByText(/Sorted by streak count/),
    ).toBeInTheDocument();
  });
});
